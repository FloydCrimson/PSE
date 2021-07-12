import * as Hapi from '@hapi/hapi';

import { ControllerPluginType } from '../../../types/controller.type';
import { AuthRouteImplementation } from './auth.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';
import { AuthMethodImplementation } from '../common/auth.implementation';

import * as EI from '../../../../database/entities.index';

export const AuthController: ControllerPluginType<AuthRouteImplementation, AuthMethodImplementation> = {
    // /auth/email-available
    EmailAvailablePOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const { email } = request.payload as { email: string; };
        const available = await this.checkAuthEntityEmailAvailability(email, false);
        const output = { available };
        return h.response(output).code(200);
    },
    // /auth/nickname-available
    NicknameAvailablePOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const { nickname } = request.payload as { nickname: string; };
        const available = await this.checkAuthEntityNicknameAvailability(nickname, false);
        const output = { available };
        return h.response(output).code(200);
    },
    // /auth/sign-in
    SignInPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const { email, nickname } = request.payload as { email: string; nickname: string; };
        await this.checkAuthEntityEmailAvailability(email, true);
        await this.checkAuthEntityNicknameAvailability(nickname, true);
        const authEntity = await this.getNewAuthEntity(email, nickname);
        await this.sendTemporaryPasswordViaEmail(authEntity);
        await this.saveAuthEntity(authEntity);
        return h.response({}).code(200);
    },
    // /auth/sign-out
    SignOutPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const authEntity = request.auth.credentials.user as EI.AuthEntity;
        await this.deleteAuthEntity({ eid: authEntity.eid });
        return h.response({}).code(200);
    },
    // /auth/log-in
    LogInPOST: (dispatcherService) => async function (request, h, err?): Promise<any> {
        const authEntity = request.auth.credentials.user as EI.AuthEntity;
        const output = { authenticated: authEntity.authenticated };
        return h.response(output).code(200);
    },
    // /auth/log-out
    LogOutPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        return h.response({}).code(200);
    },
    // /auth/recover-key
    RecoverKeyPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const authEntity = request.auth.credentials.user as EI.AuthEntity;
        authEntity.key = this.generateKey();
        authEntity.authenticated = false;
        authEntity.attempts = 0;
        await this.sendTemporaryPasswordViaEmail(authEntity);
        await this.updateAuthEntity({ eid: authEntity.eid }, { key: authEntity.key, authenticated: authEntity.authenticated, attempts: authEntity.attempts });
        return h.response({}).code(200);
    },
    // /auth/change-key
    ChangeKeyPOST: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
        const { key } = request.payload as { key: string; };
        this.checkKey(key);
        const authEntity = request.auth.credentials.user as EI.AuthEntity;
        authEntity.authenticated = true;
        authEntity.attempts = 0;
        await this.updateAuthEntity({ eid: authEntity.eid }, { key, authenticated: authEntity.authenticated, attempts: authEntity.attempts });
        return h.response({}).code(200);
    }
};
