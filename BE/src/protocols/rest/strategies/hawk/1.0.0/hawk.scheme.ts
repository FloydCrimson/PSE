import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Hawk from 'hawk';

import { SchemeStrategyType } from '../../../types/scheme.type';
import { Artifacts, Credentials, HawkMethodImplementation } from '../common/hawk.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';
import { HawkMethod } from '../common/hawk.method';

export const HawkScheme: SchemeStrategyType<HawkMethodImplementation> = {
    authenticate: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        try {
            const { api } = h.context;
            if (api.options.type === 'full') {
                const options = {};
                const { artifacts, credentials } = await this.parseRequest(request, options);
                await this.checkMac(artifacts, credentials, options);
                await this.checkNonce(artifacts, credentials, options);
                if (credentials.user.attempts === HawkMethod.ATTEMPS_MAX) {
                    throw Object.assign(Hawk.utils.unauthorized('Max attemps reached'), { artifacts, credentials });
                } else if (credentials.user.attempts > 0) {
                    credentials.user.attempts = 0;
                    await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', { eid: credentials.user.eid }, { attempts: credentials.user.attempts });
                }
                return h.authenticated({ artifacts, credentials });
            } else if (api.options.type === 'partial') {
                throw new Error('Authentication hawk.partial not supported');
            } else {
                throw new Error('Authentication type not recognized');
            }
        } catch (error) {
            return h.unauthenticated(new Boom.Boom(error, { override: !error.isBoom }));
        }
    },
    payload: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        try {
            if (request.auth.isAuthenticated) {
                const options = { payload: JSON.stringify({ body: request.payload || {}, params: request.query || {} }) };
                const { artifacts, credentials } = request.auth as unknown as { artifacts: Artifacts, credentials: Credentials };
                await this.checkPayload(artifacts, credentials, options);
            }
            return h.continue;
        } catch (error) {
            throw new Boom.Boom(error, { override: !error.isBoom });
        }
    },
    response: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        try {
            if (request.auth.isAuthenticated) {
                const response = request.response as Hapi.ResponseObject;
                const options = { payload: JSON.stringify(response.source || {}), contentType: 'application/json' };
                const { artifacts, credentials } = request.auth as unknown as { artifacts: Artifacts, credentials: Credentials };
                response.header('Access-Control-Expose-Headers', 'Server-Authorization');
                response.header('Server-Authorization', Hawk.server.header(credentials.user, artifacts, options));
                await this.checkTimestamp(artifacts, credentials, options);
            }
            return h.continue;
        } catch (error) {
            throw new Boom.Boom(error, { override: !error.isBoom });
        }
    },
    verify: (dispatcherService: DispatcherService) => async function (auth: Hapi.RequestAuth): Promise<void> {

    },
    options: { payload: true }
};

// import * as hawk from 'hawk';
// import { CoderProvider, NonceProvider } from 'pse-global-providers';

// import { CustomErrorProvider } from '../../common/providers/error.provider';
// import * as EI from '../../database/entities.index';
// import { Request, Response, NextFunction } from '../implementations/express.implementation';
// import { MiddlewareImplementation } from '../implementations/middleware.implementation';
// import { DispatcherService } from '../services/dispatcher.service';
// import { SendProvider } from '../providers/send.provider';

// const ATTEMPS_MAX = 3;

// export const AuthMiddleware: MiddlewareImplementation<{ auth: 'full' | 'partial' | 'none'; }> = (params) => {
//     params = { auth: 'none', ...params };
//     return (dispatcherService: DispatcherService) => {
//         return async (request: Request, response: Response, next: NextFunction) => {
//             let credentials: EI.AuthEntity;
//             try {
//                 if (params.auth === 'none') {
//                     response.locals.hawk = { artifacts: undefined, credentials: undefined };
//                 } else {
//                     const credentialsFunc = async (encoded) => {
//                         const decoded = JSON.parse(CoderProvider.decode(encoded));
//                         if ('id' in decoded || 'email' in decoded || 'nickname' in decoded) {
//                             return credentials = await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', decoded, { relations: ['user'] });
//                         }
//                         return undefined;
//                     };
//                     if (params.auth === 'partial') {
//                         const parsed = hawk.utils.parseRequest(request);
//                         const attributes = hawk.utils.parseAuthorizationHeader(request.headers.authorization, ['id', 'ts', 'nonce']);
//                         await credentialsFunc(attributes.id);
//                         const output = { artifacts: { method: parsed.method, host: parsed.host, port: parsed.port, resource: parsed.url, ts: attributes.ts, nonce: attributes.nonce, hash: attributes.hash, ext: attributes.ext, app: attributes.app, dlg: attributes.dlg, mac: attributes.mac, id: attributes.id } };
//                         if (credentials) {
//                             throw Object.assign(hawk.utils.unauthorized('Max attemps reached'), { artifacts: output.artifacts, credentials });
//                         } else if (credentials.attempts === ATTEMPS_MAX) {
//                             throw Object.assign(hawk.utils.unauthorized('Unknown credentials'), { artifacts: output.artifacts, credentials: undefined });
//                         }
//                         response.locals.hawk = { artifacts: output.artifacts, credentials };
//                     } else if (params.auth === 'full') {
//                         const options = { payload: JSON.stringify({ body: request.body, params: request.query.params }), nonceFunc: NonceProvider.check };
//                         const output = await hawk.server.authenticate(request, credentialsFunc, options);
//                         if (credentials.attempts === ATTEMPS_MAX) {
//                             throw Object.assign(hawk.utils.unauthorized('Max attemps reached'), { artifacts: output.artifacts, credentials });
//                         }
//                         credentials.attempts = 0;
//                         await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', { eid: credentials.eid }, { attempts: credentials.attempts });
//                         response.locals.hawk = { artifacts: output.artifacts, credentials };
//                     }
//                 }
//                 next();
//             } catch (error) {
//                 for (const header in error.output.headers) {
//                     response.setHeader(header, error.output.headers[header]);
//                     if (response.hasHeader('Access-Control-Expose-Headers')) {
//                         response.setHeader('Access-Control-Expose-Headers', response.getHeader('Access-Control-Expose-Headers') + ', ' + header);
//                     } else {
//                         response.setHeader('Access-Control-Expose-Headers', header);
//                     }
//                 }
//                 response.locals.hawk = { artifacts: error.artifacts, credentials };
//                 if (error.message === 'Unknown credentials' || error.message === 'Unauthorized') {
//                     SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'CREDENTIALS_INVALID'));
//                 } else if (error.message === 'Max attemps reached') {
//                     SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_BLOCKED'));
//                 } else if (error.message === 'Bad mac' || error.message === 'Invalid nonce') {
//                     credentials.attempts = Math.min(credentials.attempts + 1, ATTEMPS_MAX);
//                     await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', { eid: credentials.eid }, { attempts: credentials.attempts });
//                     if (credentials.attempts === ATTEMPS_MAX) {
//                         SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_BLOCKED'));
//                     } else if (credentials.attempts + 1 === ATTEMPS_MAX) {
//                         SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'KEY_INVALID_LAST'));
//                     } else {
//                         SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'KEY_INVALID'));
//                     }
//                 } else {
//                     SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'MESSAGE_INVALID'));
//                 }
//             }
//         };
//     };
// }

// import * as hawk from 'hawk';
// import { Request, Response } from '../implementations/express.implementation';

// export class SendProvider {

//     public static sendResponse(request: Request, response: Response, status: number = 200, data: any = {}): Response {
//         console.log(`Response:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
//         if (response.locals.hawk && response.locals.hawk.artifacts && response.locals.hawk.credentials) {
//             const { artifacts, credentials } = response.locals.hawk;
//             response.setHeader('Access-Control-Expose-Headers', 'Server-Authorization');
//             response.setHeader('Server-Authorization', hawk.server.header(credentials, artifacts, { payload: JSON.stringify(data), contentType: 'application/json' }));
//         }
//         response.status(status);
//         return response.send(data);
//     }

//     public static sendError(request: Request, response: Response, status: number = 500, data: any = {}): Response {
//         console.error(`Error:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
//         if (typeof data !== 'object') {
//             data = { status, error: data, message: data };
//         }
//         response.status(status);
//         return response.send(data);
//     }

// }
