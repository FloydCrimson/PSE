import 'reflect-metadata';

import * as Hapi from '@hapi/hapi';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationImplementationType } from '../../common/implementations/communication.implementation.type';
import { RouteImplementation } from '../implementations/route.implementation';
import { ControllerMethodType } from '../types/controller.type';
import { ExtensionObjectType } from '../types/extension.type';
import { SchemeStrategyType } from '../types/scheme.type';
import { ValidateObjectType } from '../types/validate.type';
import { StrategyOptionsType } from '../types/strategy.type';
import { DispatcherService } from './dispatcher.service';
import { StrategyService, StrategyServiceImplementation } from './strategy.service';
import { PluginService, PluginServiceImplementation } from './plugin.service';
import { CommunicationService } from './communication.service';

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
            const server = Hapi.server({
                port: configuration.port,
                host: 'localhost',
                debug: { log: ['*'], request: ['*'] }
            });
            for (const strategy of this.strategyService.keys()) {
                await this.addSchemeAndStrategies(strategy, server);
            }
            for (const plugin of this.pluginService.keys()) {
                await this.addPlugin(plugin, server);
            }
            return server;
        }));
        const result = await Promise.all(servers.map((server) => {
            return server.start().then(_ => {
                console.log(`Express Rest server has started on port ${server.info.port}. Open ${server.info.uri}/echo/echo to see results.`);
                return true;
            }).catch((error) => {
                console.error(`Express Rest server has not started on port ${server.info.port}.`, error);
                return false;
            });
        })).then((results) => !results.some(c => !c));
        if (result) {
            this.communicationClientService.receive();
        }
        return result;
    }

    // STRATEGY

    private async addSchemeAndStrategies<K extends keyof StrategyServiceImplementation>(type: K, server: Hapi.Server): Promise<void> {
        const prefix = ['Strategy', type].join('.');
        const strategies = this.strategyService.get(type);
        const config = await strategies.config();
        const instance = strategies.common.method ? new (await strategies.common.method())(this.dispatcherService) : undefined;
        if (instance && config.methods) {
            for (const method in config.methods) {
                server.method({
                    name: [prefix, method].join('.'),
                    method: instance[method],
                    options: { bind: instance }
                });
            }
        }
        const version = config.version;
        const scheme = await strategies.version[version]();
        server.auth.scheme(type, (server, options?) => {
            return {
                api: { config: scheme.scheme.config || {}, options: options || {} },
                authenticate: this.authenticateMapper(scheme.scheme.authenticate, this.getChild(server.methods, prefix)),
                payload: this.payloadMapper(scheme.scheme.payload, this.getChild(server.methods, prefix)),
                response: this.responseMapper(scheme.scheme.response, this.getChild(server.methods, prefix)),
                verify: this.verifyMapper(scheme.scheme.verify, this.getChild(server.methods, prefix)),
                options: scheme.scheme.options
            };
        });
        for (const strategy in scheme.strategies) {
            server.auth.strategy(scheme.strategies[strategy].auth.strategy, type, scheme.strategies[strategy].options);
        }
    }

    private authenticateMapper<M = any>(authenticate: SchemeStrategyType<M>['authenticate'], methods?: M): Hapi.ServerAuthSchemeObject['authenticate'] {
        return (request, h) => authenticate(this.dispatcherService).apply(methods ? methods : void undefined, [request, h]);
    }

    private payloadMapper<M = any>(payload?: SchemeStrategyType<M>['payload'], methods?: M): Hapi.ServerAuthSchemeObject['payload'] {
        return payload ? (request, h) => payload(this.dispatcherService).apply(methods ? methods : void undefined, [request, h]) : undefined;
    }

    private responseMapper<M = any>(response?: SchemeStrategyType<M>['response'], methods?: M): Hapi.ServerAuthSchemeObject['response'] {
        return response ? (request, h) => response(this.dispatcherService).apply(methods ? methods : void undefined, [request, h]) : undefined;
    }

    private verifyMapper<M = any>(verify?: SchemeStrategyType<M>['verify'], methods?: M): Hapi.ServerAuthSchemeObject['verify'] {
        return verify ? (auth) => verify(this.dispatcherService).apply(methods ? methods : void undefined, [auth]) : undefined;
    }

    // PLUGIN

    private async addPlugin<K extends keyof PluginServiceImplementation>(type: K, server: Hapi.Server): Promise<void> {
        const prefix = ['Plugin', type].join('.');
        const plugins = this.pluginService.get(type);
        const config = await plugins.config();
        const instance = plugins.common.method ? new (await plugins.common.method())(this.dispatcherService) : undefined;
        if (instance && config.methods) {
            for (const method in config.methods) {
                server.method({
                    name: [prefix, method].join('.'),
                    method: instance[method],
                    options: { bind: instance }
                });
            }
        }
        await server.register({
            plugin: {
                name: config.name,
                register: async (server) => {
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
                                    validate: this.validateMapper(plugin.validate ? plugin.validate[route] : undefined, this.getChild(server.methods, prefix)),
                                    response: this.outputMapper(plugin.validate ? plugin.validate[route] : undefined, this.getChild(server.methods, prefix)),
                                    cors: this.corsMapper(plugin.route[route].options ? plugin.route[route].options.cors : undefined),
                                    auth: this.authMapper(plugin.route[route].options ? plugin.route[route].options.auth : undefined)
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    private controllerMapper<R extends RouteImplementation, M = any>(controller?: ControllerMethodType<R, M>, methods?: M): Hapi.ServerRoute['handler'] {
        return (request, h, err) => controller ? controller(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]) : h.response({}).code(200);
    }

    private extensionMapper<R extends RouteImplementation, M = any>(extension?: { [KR in Hapi.RouteRequestExtType]?: ExtensionObjectType<R, M>[] }, methods?: M): Hapi.RouteOptions['ext'] {
        return extension ? {
            onCredentials: extension.onCredentials ? extension.onCredentials.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
            onPostAuth: extension.onPostAuth ? extension.onPostAuth.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
            onPostHandler: extension.onPostHandler ? extension.onPostHandler.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
            onPostResponse: extension.onPostResponse ? extension.onPostResponse.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
            onPreAuth: extension.onPreAuth ? extension.onPreAuth.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
            onPreHandler: extension.onPreHandler ? extension.onPreHandler.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
            onPreResponse: extension.onPreResponse ? extension.onPreResponse.map((o) => { return { method: (request, h, err) => o.method(this.dispatcherService).apply(methods ? methods : void undefined, [request, h, err]), options: o.options }; }) : undefined,
        } : undefined;
    }

    private validateMapper<R extends RouteImplementation, M = any>(validate?: ValidateObjectType<R, M>, methods?: M): Hapi.RouteOptions['validate'] {
        return validate ? {
            headers: validate.headers ? (value, options) => validate.headers(this.dispatcherService).apply(methods ? methods : void undefined, [value, options]) : undefined,
            params: validate.params ? (value, options) => validate.params(this.dispatcherService).apply(methods ? methods : void undefined, [value, options]) : undefined,
            payload: validate.payload ? (value, options) => validate.payload(this.dispatcherService).apply(methods ? methods : void undefined, [value, options]) : undefined,
            query: validate.query ? (value, options) => validate.query(this.dispatcherService).apply(methods ? methods : void undefined, [value, options]) : undefined,
            state: validate.state ? (value, options) => validate.state(this.dispatcherService).apply(methods ? methods : void undefined, [value, options]) : undefined,
            options: validate.options
        } : undefined;
    }

    private outputMapper<R extends RouteImplementation, M = any>(validate?: ValidateObjectType<R, M>, methods?: M): Hapi.RouteOptions['response'] {
        return validate ? {
            schema: validate.output ? (value, options) => validate.output(this.dispatcherService).apply(methods ? methods : void undefined, [value, options]) : undefined,
            options: validate.options
        } : undefined;
    }

    private corsMapper(cors?: Hapi.RouteOptionsCors): Hapi.RouteOptions['cors'] {
        return cors ? cors : false;
    }

    private authMapper(auth?: StrategyOptionsType): Hapi.RouteOptions['auth'] {
        return auth ? auth.auth : false;
    }

    // SUPPORT

    private getChild(object: any, path: string): any {
        return path.split('.').reduce((o, k) => o[k], object);
    }

}
