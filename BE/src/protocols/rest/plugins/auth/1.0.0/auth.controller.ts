import { Request, ResponseToolkit } from '@hapi/hapi';

import { ControllerPluginType } from '../../../types/controller.type';
import { AuthRouteImplementation } from './auth.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';
import { AuthMethodImplementation } from '../common/auth.implementation';

export const AuthController: ControllerPluginType<AuthRouteImplementation, AuthMethodImplementation> = {
    // /auth/email-available
    EmailAvailablePOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const { email } = request.payload as any;
        const available = await this.checkAuthEntityEmailAvailability(email, false);
        const output = { available };
        return h.response(output).code(200);
    },
    // /auth/nickname-available
    NicknameAvailablePOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const { nickname } = request.payload as any;
        const available = await this.checkAuthEntityNicknameAvailability(nickname, false);
        const output = { available };
        return h.response(output).code(200);
    },
    // /auth/sign-in
    SignInPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const { email, nickname } = request.payload as any;
        await this.checkAuthEntityEmailAvailability(email, true);
        await this.checkAuthEntityNicknameAvailability(nickname, true);
        const authEntity = await this.getNewAuthEntity(email, nickname);
        await this.sendTemporaryPasswordViaEmail(authEntity);
        await this.saveAuthEntity(authEntity);
        return h.response().code(200);
    },
    // /auth/sign-out
    SignOutPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        return h.response().code(200);
    },
    // /auth/log-in
    LogInPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const output = { authenticated: true }; // TODO: recover info from local session
        return h.response(output).code(200);
    },
    // /auth/log-out
    LogOutPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        return h.response().code(200);
    },
    // /auth/recover-key
    RecoverKeyPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const { type, value } = request.payload as any;
        const authEntity = await this.getAuthEntity(type, value);
        authEntity.key = this.generateKey();
        authEntity.authenticated = false;
        authEntity.attempts = 0;
        await this.sendTemporaryPasswordViaEmail(authEntity);
        await this.updateAuthEntity({ eid: authEntity.eid }, { key: authEntity.key, authenticated: authEntity.authenticated, attempts: authEntity.attempts });
        return h.response().code(200);
    },
    // /auth/change-key
    ChangeKeyPOST: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        const { key } = request.payload as any;
        this.checkKey(key);
        const authEntity = {} as any; // TODO: recover info from local session
        authEntity.authenticated = true;
        authEntity.attempts = 0;
        await this.updateAuthEntity({ eid: authEntity.eid }, { key, authenticated: authEntity.authenticated, attempts: authEntity.attempts });
        return h.response().code(200);
    }
};
