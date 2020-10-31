import { EmailProvider } from '../../../global/providers/email.provider';
import { RandomProvider } from '../../../global/providers/random.provider';

import { CustomErrorProvider } from '../../common/providers/error.provider';

import { RoleType } from '../../database/types/role.type';
import * as EI from '../../database/entities.index';

import { DispatcherService } from '../services/dispatcher.service';
import { AuthRouteImplementation } from '../routes/auth.route';
import { ControllerMethodType } from '../types/controller-method.type';

export class AuthController implements AuthControllerImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async EmailAvailablePOST(body: { email: string; }, params: undefined, output: { available: boolean; }): Promise<{ available: boolean; }> {
        const { email } = body;
        const available = await this.checkAuthEntityEmailAvailability(email, false);
        output = { available };
        return output;
    }

    public async NicknameAvailablePOST(body: { nickname: string; }, params: undefined, output: { available: boolean; }): Promise<{ available: boolean; }> {
        const { nickname } = body;
        const available = await this.checkAuthEntityNicknameAvailability(nickname, false);
        output = { available };
        return output;
    }

    public async SignInPOST(body: { email: string; nickname: string; }, params: undefined, output: { success: boolean; }): Promise<{ success: boolean; }> {
        const { email, nickname } = body;
        await this.checkAuthEntityEmailAvailability(email, true);
        await this.checkAuthEntityNicknameAvailability(nickname, true);
        const authEntity = await this.getNewAuthEntity(email, nickname);
        await this.saveAuthEntity(authEntity);
        await this.sendTemporaryPasswordViaEmail(authEntity);
        output = { success: true };
        return output;
    }

    public async SignOutPOST(body: undefined, params: undefined, output: undefined): Promise<undefined> {
        return output;
    }

    public async LogInPOST(body: undefined, params: undefined, output: undefined): Promise<undefined> {
        return output;
    }

    public async LogOutPOST(body: undefined, params: undefined, output: undefined): Promise<undefined> {
        return output;
    }

    //

    private async checkAuthEntityEmailAvailability(email: string, throwIfNotAvailable: boolean): Promise<boolean> {
        let authEntity: EI.AuthEntity;
        try {
            authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { email });
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'EMAIL_NOT_RECOVERED');
        }
        const available = authEntity === undefined;
        if (throwIfNotAvailable && !available) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'EMAIL_NOT_AVAILABLE');
        }
        return available;
    }

    private async checkAuthEntityNicknameAvailability(nickname: string, throwIfNotAvailable: boolean): Promise<boolean> {
        let authEntity: EI.AuthEntity;
        try {
            authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { nickname });
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'NICKNAME_NOT_RECOVERED');
        }
        const available = authEntity === undefined;
        if (throwIfNotAvailable && !available) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'NICKNAME_NOT_AVAILABLE');
        }
        return available;
    }

    private async getAvailableAuthEntityId(): Promise<string> {
        let id: string;
        let authEntity: EI.AuthEntity;
        do {
            id = RandomProvider.decimal(100000000, 1000000000).toString();
            try {
                authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { id });
            } catch (error) {
                throw CustomErrorProvider.getError('Rest', 'AUTH', 'ID_NOT_RECOVERED');
            }
        } while (authEntity !== undefined);
        return id;
    }

    private async getNewAuthEntity(email: string, nickname: string): Promise<EI.AuthEntity> {
        const authEntity = new EI.AuthEntity();
        authEntity.id = await this.getAvailableAuthEntityId();
        authEntity.email = email;
        authEntity.nickname = nickname;
        authEntity.key = RandomProvider.base64(4).toLocaleUpperCase();
        authEntity.algorithm = 'sha256';
        authEntity.role = RoleType.USER;
        authEntity.authenticated = false;
        authEntity.attempts = 0;
        return authEntity;
    }

    private async saveAuthEntity(authEntity: EI.AuthEntity): Promise<void> {
        try {
            await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntitySave', authEntity);
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_SAVED');
        }
    }

    private async sendTemporaryPasswordViaEmail(authEntity: EI.AuthEntity): Promise<void> {
        try {
            await EmailProvider.send({
                from: 'PSE',
                to: authEntity.email,
                subject: 'SignIn Request',
                text: `Hello ${authEntity.nickname}!\n\nHere is your Temporary Password:\n\n${authEntity.key}\n\nYou will be asked to change it after your first access.\n\nThanks, PSE`,
                html: `Hello ${authEntity.nickname}!<br><br>Here is your Temporary Password:<br><br><b>${authEntity.key}</b><br><br>You will be asked to change it after your first access.<br><br>Thanks, PSE`
            });
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'EMAIL_NOT_SENT');
        }
    }

}

interface AuthControllerImplementation {
    EmailAvailablePOST: ControllerMethodType<AuthRouteImplementation['EmailAvailablePOST']>;
    NicknameAvailablePOST: ControllerMethodType<AuthRouteImplementation['NicknameAvailablePOST']>;
    SignInPOST: ControllerMethodType<AuthRouteImplementation['SignInPOST']>;
    SignOutPOST: ControllerMethodType<AuthRouteImplementation['SignOutPOST']>;
    LogInPOST: ControllerMethodType<AuthRouteImplementation['LogInPOST']>;
    LogOutPOST: ControllerMethodType<AuthRouteImplementation['LogOutPOST']>;
}
