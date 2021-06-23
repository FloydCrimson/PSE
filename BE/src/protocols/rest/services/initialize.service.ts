import 'reflect-metadata';

import * as hapi from '@hapi/hapi';
import { Plugin, RouteExtObject, RouteOptions, RouteOptionsAccess, RouteOptionsCors, RouteRequestExtType, ServerAuthScheme, ServerAuthSchemeObject, ServerRoute } from '@hapi/hapi';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationImplementationType } from '../../common/implementations/communication.implementation.type';
import { RouteImplementation } from '../implementations/route.implementation';
import { ControllerMethodType } from '../types/controller.type';
import { ExtensionObjectType } from '../types/extension.type';
import { DispatcherService } from './dispatcher.service';
import { StrategyService, StrategyServiceImplementation } from './strategy.service';
import { PluginService, PluginServiceImplementation } from './plugin.service';
import { CommunicationService } from './communication.service';

import * as SI from '../strategies.index';
import * as PI from '../plugins.index';
import { SchemeStrategyType } from '../types/scheme.type';

export class InitializeService implements InitializeImplementation {

    private readonly dispatcherService = new DispatcherService();
    private readonly strategyService = new StrategyService(this.dispatcherService);
    private readonly pluginService = new PluginService(this.dispatcherService);
    private readonly communicationClientService = new CommunicationClientService<CommunicationImplementationType, 'rest'>(new CommunicationService(), 'rest');

    constructor() {
        this.dispatcherService.set('StrategyService', this.strategyService);
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
            for (const strategy in SI) {
                server.auth.scheme(strategy, await this.getStrategy(strategy as keyof StrategyServiceImplementation));
                server.auth.strategy(strategy, strategy);
            }
            for (const plugin in PI) {
                await server.register({ plugin: await this.getPlugin(plugin as keyof PluginServiceImplementation) });
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

    // STRATEGY

    private async getStrategy<K extends keyof StrategyServiceImplementation>(type: K): Promise<ServerAuthScheme> {
        const prefix = ['Strategy', type].join('.');
        const strategies = this.strategyService.get(type);
        const config = await strategies.config();
        const instance = strategies.common.method ? new (await strategies.common.method())(this.dispatcherService) : undefined;
        const version = config.version;
        const strategy = await strategies.version[version]();
        return (server) => {
            if (instance && config.methods) {
                for (const method in config.methods) {
                    server.method({
                        name: [prefix, method].join('.'),
                        method: instance[method],
                        options: {
                            bind: instance
                        }
                    });
                }
            }
            return {
                api: strategy.scheme.api,
                authenticate: this.authenticateMapper(strategy.scheme.authenticate, this.getChild(server.methods, prefix)),
                payload: this.payloadMapper(strategy.scheme.payload, this.getChild(server.methods, prefix)),
                response: this.responseMapper(strategy.scheme.response, this.getChild(server.methods, prefix)),
                verify: this.verifyMapper(strategy.scheme.verify, this.getChild(server.methods, prefix)),
                options: strategy.scheme.options
            };
        };
    }

    private authenticateMapper<M = any>(authenticate: SchemeStrategyType<M>['authenticate'], methods?: M): ServerAuthSchemeObject['authenticate'] {
        return (request, h) => authenticate(this.dispatcherService).apply(methods ? methods : void undefined, [request, h]);
    }

    private payloadMapper<M = any>(payload?: SchemeStrategyType<M>['payload'], methods?: M): ServerAuthSchemeObject['payload'] {
        return payload ? (request, h) => payload(this.dispatcherService).apply(methods ? methods : void undefined, [request, h]) : undefined;
    }

    private responseMapper<M = any>(response?: SchemeStrategyType<M>['response'], methods?: M): ServerAuthSchemeObject['response'] {
        return response ? (request, h) => response(this.dispatcherService).apply(methods ? methods : void undefined, [request, h]) : undefined;
    }

    private verifyMapper<M = any>(verify?: SchemeStrategyType<M>['verify'], methods?: M): ServerAuthSchemeObject['verify'] {
        return verify ? (auth) => verify(this.dispatcherService).apply(methods ? methods : void undefined, [auth]) : undefined;
    }

    // PLUGIN

    private async getPlugin<K extends keyof PluginServiceImplementation>(type: K): Promise<Plugin<any>> {
        const prefix = ['Plugin', type].join('.');
        const plugins = this.pluginService.get(type);
        const config = await plugins.config();
        const instance = plugins.common.method ? new (await plugins.common.method())(this.dispatcherService) : undefined;
        return {
            name: config.name,
            register: async (server) => {
                if (instance && config.methods) {
                    for (const method in config.methods) {
                        server.method({
                            name: [prefix, method].join('.'),
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
                            handler: this.controllerMapper(plugin.controller ? plugin.controller[route] : undefined, this.getChild(server.methods, prefix)),
                            options: {
                                ext: this.extensionMapper(plugin.extension ? plugin.extension[route] : undefined, this.getChild(server.methods, prefix)),
                                cors: this.corsMapper(plugin.route[route].options ? plugin.route[route].options.cors : undefined),
                                auth: this.authMapper(plugin.route[route].options ? plugin.route[route].options.auth : undefined)
                            }
                        });
                    }
                }
            }
        };
    }

    private controllerMapper<R extends RouteImplementation, M = any>(controller?: ControllerMethodType<R, M>, methods?: M): ServerRoute['handler'] {
        return (request, h, err) => controller ? controller(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]) : h.response().code(200);
    }

    private extensionMapper<R extends RouteImplementation, M = any>(extension?: { [KR in RouteRequestExtType]?: ExtensionObjectType<R, M>[] }, methods?: M): RouteOptions['ext'] {
        return extension ? Object.entries(extension).reduce<RouteOptions['ext']>((r, [p, a]) => {
            r[p] = a.map((o) => {
                return {
                    method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]),
                    options: o.options
                };
            });
            return r;
        }, {}) : {};
    }

    private corsMapper(cors?: RouteOptionsCors): RouteOptions['cors'] {
        return cors ? cors : false;
    }

    private authMapper(auth?: RouteOptionsAccess): RouteOptions['auth'] {
        return auth ? auth : false;
    }

    // SUPPORT

    private getChild(object: any, path: string): any {
        return path.split('.').reduce((o, k) => o[k], object);
    }

}
