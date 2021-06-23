import 'reflect-metadata';

import * as hapi from '@hapi/hapi';
import { CommonRouteProperties, Plugin, RouteExtObject, RouteOptionsCors, RouteRequestExtType, Server, ServerRoute } from '@hapi/hapi';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationImplementationType } from '../../common/implementations/communication.implementation.type';
import { RouteImplementation } from '../implementations/route.implementation';
import { ControllerMethodType } from '../types/controller.type';
import { ExtensionObjectType } from '../types/extension.type';
import { DispatcherService } from './dispatcher.service';
import { PluginService, PluginServiceImplementation } from './plugin.service';
import { CommunicationService } from './communication.service';

import * as PI from '../plugins.index';

export class InitializeService implements InitializeImplementation {

    private readonly dispatcherService = new DispatcherService();
    private readonly pluginService = new PluginService(this.dispatcherService);
    private readonly communicationClientService = new CommunicationClientService<CommunicationImplementationType, 'rest'>(new CommunicationService(), 'rest');

    constructor() {
        this.dispatcherService.set('PluginService', this.pluginService);
        this.dispatcherService.set('CommunicationClientService', this.communicationClientService);
    }

    public async initialize(configurations: ProtocolConfigurationsType[]): Promise<boolean> {
        const servers = await Promise.all(configurations.map(async (configuration) => {
            const server = hapi.server({
                port: configuration.port,
                host: 'localhost',
                debug: { log: ['*'], request: ['*'] }
            });
            for (const plugin in PI) {
                await server.register({
                    plugin: await this.getPlugin(plugin as keyof typeof PI)
                });
            }
            return server;
        }));
        const result = await Promise.all(servers.map((server) => {
            return server.start().then((result) => {
                console.log(`Express Rest server has started on port ${server.info.port}. Open ${server.info.uri}/echo/echo to see results.`, result);
                return true;
            }).catch((error) => {
                console.error(`Express Rest server has not started on port ${server.info.port}. Open ${server.info.uri}/echo/echo to see results.`, error);
                return false;
            });
        })).then((results) => !results.some(c => !c));
        if (result) {
            this.communicationClientService.receive();
        }
        return result;
    }

    //

    private async getPlugin<K extends keyof PluginServiceImplementation>(type: K): Promise<Plugin<any>> {
        const plugins = this.pluginService.get(type);
        const config = await plugins.config();
        return {
            name: config.name,
            register: async (server: Server, options: any) => {
                if (config.methods) {
                    const instance = new (await plugins.common.method())(this.dispatcherService);
                    for (const method in config.methods) {
                        server.method({
                            name: type + '.' + method,
                            method: instance[method],
                            options: {
                                bind: instance
                            }
                        });
                    }
                }
                if (config.routes) {
                    for (const route in config.routes) {
                        const version = config.routes[route].version;
                        const plugin = await plugins.version[version]();
                        server.route({
                            method: plugin.route[route].method,
                            path: plugin.route[route].path,
                            handler: this.controllerMapper(plugin.controller ? plugin.controller[route] : undefined, server.methods[type]),
                            options: {
                                ext: this.extensionMapper(plugin.extension ? plugin.extension[route] : undefined, server.methods[type]),
                                cors: this.corsMapper(plugin.route[route].options ? plugin.route[route].options.cors : undefined)
                            }
                        });
                    }
                }
            }
        };
    }

    private controllerMapper<R extends RouteImplementation, M = any>(controller?: ControllerMethodType<R, M>, methods?: M): ServerRoute['handler'] {
        return (request, h, err): ServerRoute['handler'] => controller ? controller(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]) : h.response().code(200);
    }

    private extensionMapper<R extends RouteImplementation, M = any>(extension?: { [KR in RouteRequestExtType]?: ExtensionObjectType<R, M>[] }, methods?: M): CommonRouteProperties['ext'] {
        return extension ? Object.entries(extension).reduce<CommonRouteProperties['ext']>((r, [p, a]) => {
            r[p] = a.map((o) => {
                return {
                    method: (request, h, err): RouteExtObject['method'] => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]),
                    options: o.options
                };
            });
            return r;
        }, {}) : {};
    }

    private corsMapper(cors?: RouteOptionsCors): CommonRouteProperties['cors'] {
        return cors ? cors : false;
    }

}
