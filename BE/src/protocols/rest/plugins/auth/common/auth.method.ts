
import { FindConditions, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RandomProvider } from 'pse-global-providers';

import { EmailProvider } from '../../../../../global/providers/email.provider';

import { CustomErrorProvider } from '../../../../common/providers/error.provider';

import { RoleType } from '../../../../database/types/role.type';
import * as EI from '../../../../database/entities.index';

import { AuthMethodImplementation } from './auth.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';

export class AuthMethod implements AuthMethodImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async checkAuthEntityEmailAvailability(email: string, throwIfNotAvailable: boolean): Promise<boolean> {
        let authEntity: EI.AuthEntity;
        try {
            authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { email: email.toLowerCase() });
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'EMAIL_NOT_RECOVERED');
        }
        const available = authEntity === undefined;
        if (throwIfNotAvailable && !available) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'EMAIL_NOT_AVAILABLE');
        }
        return available;
    }

    public async checkAuthEntityNicknameAvailability(nickname: string, throwIfNotAvailable: boolean): Promise<boolean> {
        let authEntity: EI.AuthEntity;
        try {
            authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { nickname: nickname.toLowerCase() });
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'NICKNAME_NOT_RECOVERED');
        }
        const available = authEntity === undefined;
        if (throwIfNotAvailable && !available) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'NICKNAME_NOT_AVAILABLE');
        }
        return available;
    }

    public async getAvailableAuthEntityId(): Promise<string> {
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

    public async getNewAuthEntity(email: string, nickname: string): Promise<EI.AuthEntity> {
        const authEntity = new EI.AuthEntity();
        authEntity.id = await this.getAvailableAuthEntityId();
        authEntity.email = email;
        authEntity.nickname = nickname;
        authEntity.key = this.generateKey();
        authEntity.algorithm = 'sha256';
        authEntity.role = RoleType.USER;
        return authEntity;
    }

    public async saveAuthEntity(authEntity: EI.AuthEntity, options?: SaveOptions): Promise<void> {
        try {
            await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntitySave', authEntity, options);
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_SAVED');
        }
    }

    public async updateAuthEntity(criteria: FindConditions<EI.AuthEntity>, partialEntity: QueryDeepPartialEntity<EI.AuthEntity>): Promise<void> {
        try {
            await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityUpdate', criteria, partialEntity);
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_UPDATED');
        }
    }

    public async deleteAuthEntity(criteria: FindConditions<EI.AuthEntity>): Promise<void> {
        try {
            await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityDelete', criteria);
        } catch (error) {
            throw CustomErrorProvider.getError('Rest', 'AUTH', 'AUTH_ENTITY_NOT_DELETED');
        }
    }

    public async getAuthEntity(type: 'id' | 'email' | 'nickname', value: string): Promise<EI.AuthEntity> {
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

    public async sendTemporaryPasswordViaEmail(authEntity: EI.AuthEntity): Promise<void> {
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

    public generateKey(): string {
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

    public checkKey(key: string): void {
        // TODO
    }

};
