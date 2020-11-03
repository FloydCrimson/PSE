import * as hawk from '@hapi/hawk';

import { CoderProvider } from '../../../global/providers/coder.provider';
import { NonceProvider } from '../../../global/providers/nonce.provider';
import { CustomErrorProvider } from '../../common/providers/error.provider';
import * as EI from '../../database/entities.index';
import { Request, Response, NextFunction } from '../implementations/express.implementation';
import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { SendProvider } from '../providers/send.provider';

const ATTEMPS_MAX = 3;

export const AuthMiddleware: MiddlewareImplementation<{ auth: 'full' | 'partial' | 'none'; }> = (params) => {
    params = { auth: 'none', ...params };
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            let credentials: EI.AuthEntity;
            try {
                if (params.auth === 'none') {
                    response.locals.hawk = { artifacts: undefined, credentials: undefined };
                    response.locals.authenticated = true;
                } else {
                    const credentialsFunc = async (encoded) => {
                        const decoded = JSON.parse(CoderProvider.decode(encoded));
                        if ('id' in decoded || 'email' in decoded || 'nickname' in decoded) {
                            return credentials = await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', decoded, { relations: ['user'] });
                        }
                        return undefined;
                    };
                    if (params.auth === 'partial') {
                        const parsed = hawk.utils.parseRequest(request);
                        const attributes = hawk.utils.parseAuthorizationHeader(request.headers.authorization, ['id', 'ts', 'nonce']);
                        await credentialsFunc(attributes.id);
                        const output = { artifacts: { method: parsed.method, host: parsed.host, port: parsed.port, resource: parsed.url, ts: attributes.ts, nonce: attributes.nonce, hash: attributes.hash, ext: attributes.ext, app: attributes.app, dlg: attributes.dlg, mac: attributes.mac, id: attributes.id } };
                        if (credentials) {
                            throw Object.assign(hawk.utils.unauthorized('Max attemps reached'), { artifacts: output.artifacts, credentials });
                        } else if (credentials.attempts === ATTEMPS_MAX) {
                            throw Object.assign(hawk.utils.unauthorized('Unknown credentials'), { artifacts: output.artifacts, credentials: undefined });
                        }
                        response.locals.hawk = { artifacts: output.artifacts, credentials };
                        response.locals.authenticated = true;
                    } else if (params.auth === 'full') {
                        const options = { payload: JSON.stringify({ body: request.body, params: request.query.params }), nonceFunc: NonceProvider.check };
                        const output = await hawk.server.authenticate(request, credentialsFunc, options);
                        if (credentials.attempts === ATTEMPS_MAX) {
                            throw Object.assign(hawk.utils.unauthorized('Max attemps reached'), { artifacts: output.artifacts, credentials });
                        }
                        credentials.attempts = 0;
                        await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', { eid: credentials.eid }, { attempts: credentials.attempts });
                        response.locals.hawk = { artifacts: output.artifacts, credentials };
                        response.locals.authenticated = true;
                    }
                }
                next();
            } catch (error) {
                for (const header in error.output.headers) {
                    response.setHeader(header, error.output.headers[header]);
                    if (response.hasHeader('Access-Control-Expose-Headers')) {
                        response.setHeader('Access-Control-Expose-Headers', response.getHeader('Access-Control-Expose-Headers') + ', ' + header);
                    } else {
                        response.setHeader('Access-Control-Expose-Headers', header);
                    }
                }
                response.locals.hawk = { artifacts: error.artifacts, credentials };
                response.locals.authenticated = false;
                if (error.message === 'Unknown credentials') {
                    SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'CREDENTIALS_INVALID'));
                } else if (error.message === 'Max attemps reached') {
                    SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_BLOCKED'));
                } else if (error.message === 'Bad mac' || error.message === 'Invalid nonce') {
                    credentials.attempts = Math.min(credentials.attempts + 1, ATTEMPS_MAX);
                    await dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', { eid: credentials.eid }, { attempts: credentials.attempts });
                    if (credentials.attempts === ATTEMPS_MAX) {
                        SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_BLOCKED'));
                    } else if (credentials.attempts + 1 === ATTEMPS_MAX) {
                        SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'KEY_INVALID_LAST'));
                    } else {
                        SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'KEY_INVALID'));
                    }
                } else {
                    SendProvider.sendError(request, response, error.output.statusCode, CustomErrorProvider.getError('Rest', 'AUTH', 'MESSAGE_INVALID'));
                }
            }
        };
    };
}
