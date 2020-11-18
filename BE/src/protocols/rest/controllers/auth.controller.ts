import { FindConditions, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RandomProvider } from 'pse-global-providers';

import { EmailProvider } from '../../../global/providers/email.provider';

import { CustomErrorProvider } from '../../common/providers/error.provider';

import { RoleType } from '../../database/types/role.type';
import * as EI from '../../database/entities.index';

import { Locals } from '../implementations/express.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { AuthRouteImplementation } from '../routes/auth.route';
import { ControllerMethodType } from '../types/controller-method.type';

export class AuthController implements AuthControllerImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async EmailAvailablePOST(locals: Locals, body: { email: string; }, params: undefined, output: { available: boolean; }): Promise<{ available: boolean; }> {
        const { email } = body;
        const available = await this.checkAuthEntityEmailAvailability(email, false);
        output = { available };
        return output;
    }

    public async NicknameAvailablePOST(locals: Locals, body: { nickname: string; }, params: undefined, output: { available: boolean; }): Promise<{ available: boolean; }> {
        const { nickname } = body;
        const available = await this.checkAuthEntityNicknameAvailability(nickname, false);
        output = { available };
        return output;
    }

    public async SignInPOST(locals: Locals, body: { email: string; nickname: string; }, params: undefined, output: undefined): Promise<undefined> {
        const { email, nickname } = body;
        await this.checkAuthEntityEmailAvailability(email, true);
        await this.checkAuthEntityNicknameAvailability(nickname, true);
        const authEntity = await this.getNewAuthEntity(email, nickname);
        await this.sendTemporaryPasswordViaEmail(authEntity);
        await this.saveAuthEntity(authEntity);
        return output;
    }

    public async SignOutPOST(locals: Locals, body: undefined, params: undefined, output: undefined): Promise<undefined> {
        return output;
    }

    public async LogInPOST(locals: Locals, body: undefined, params: undefined, output: { authenticated: boolean; }): Promise<{ authenticated: boolean; }> {
        output = { authenticated: locals.hawk.credentials.authenticated };
        return output;
    }

    public async LogOutPOST(locals: Locals, body: undefined, params: undefined, output: undefined): Promise<undefined> {
        return output;
    }

    public async RecoverKeyPOST(locals: Locals, body: { type: 'id' | 'email' | 'nickname'; value: string; }, params: undefined, output: undefined): Promise<undefined> {
        const { type, value } = body;
        const authEntity = await this.getAuthEntity(type, value);
        authEntity.key = this.generateKey();
        authEntity.authenticated = false;
        authEntity.attempts = 0;
        await this.sendTemporaryPasswordViaEmail(authEntity);
        await this.updateAuthEntity({ eid: authEntity.eid }, { key: authEntity.key, authenticated: authEntity.authenticated, attempts: authEntity.attempts });
        return output;
    }

    public async ChangeKeyPOST(locals: Locals, body: { key: string; }, params: undefined, output: undefined): Promise<undefined> {
        const { key } = body;
        this.checkKey(key);
        const authEntity = locals.hawk.credentials;
        authEntity.authenticated = true;
        authEntity.attempts = 0;
        await this.updateAuthEntity({ eid: authEntity.eid }, { key, authenticated: authEntity.authenticated, attempts: authEntity.attempts });
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
        authEntity.key = this.generateKey();
        authEntity.algorithm = 'sha256';
        authEntity.role = RoleType.USER;
        return authEntity;
    }

    private async saveAuthEntity(authEntity: EI.AuthEntity, options?: SaveOptions): Promise<void> {
        try {
            await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntitySave', authEntity, options);
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_SAVED');
        }
    }

    private async updateAuthEntity(criteria: FindConditions<EI.AuthEntity>, partialEntity: QueryDeepPartialEntity<EI.AuthEntity>): Promise<void> {
        try {
            await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', criteria, partialEntity);
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_SAVED');
        }
    }

    private async getAuthEntity(type: 'id' | 'email' | 'nickname', value: string): Promise<EI.AuthEntity> {
        let authEntity: EI.AuthEntity;
        try {
            authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { [type]: value }, { relations: ['user'] });
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_RECOVERED');
        }
        if (authEntity === undefined) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_FOUND');
        }
        return authEntity;
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

    private generateKey(): string {
        const symbols: { seed: string; length: number; }[] = [
            { seed: 'abcdefghijklmnopqrstuvwxyz', length: 3 },
            { seed: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', length: 3 },
            { seed: '1234567890', length: 2 },
            { seed: '@$!%*?&', length: 1 }
        ];
        const key = symbols.map((symbol) => {
            let k = '';
            for (let i = 0; i < symbol.length; i++) {
                k += symbol.seed[Math.floor(Math.random() * symbol.seed.length)];
            }
            return k;
        }).join('');
        const array = Array.from(key);
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    private checkKey(key: string): void {
        // TODO
    }

}

interface AuthControllerImplementation {
    EmailAvailablePOST: ControllerMethodType<AuthRouteImplementation['EmailAvailablePOST']>;
    NicknameAvailablePOST: ControllerMethodType<AuthRouteImplementation['NicknameAvailablePOST']>;
    SignInPOST: ControllerMethodType<AuthRouteImplementation['SignInPOST']>;
    SignOutPOST: ControllerMethodType<AuthRouteImplementation['SignOutPOST']>;
    LogInPOST: ControllerMethodType<AuthRouteImplementation['LogInPOST']>;
    LogOutPOST: ControllerMethodType<AuthRouteImplementation['LogOutPOST']>;
    RecoverKeyPOST: ControllerMethodType<AuthRouteImplementation['RecoverKeyPOST']>;
    ChangeKeyPOST: ControllerMethodType<AuthRouteImplementation['ChangeKeyPOST']>;
}
