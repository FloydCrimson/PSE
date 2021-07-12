import { FindConditions, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import * as EI from '../../../../database/entities.index';

export interface AuthMethodImplementation {
    checkAuthEntityEmailAvailability(email: string, throwIfNotAvailable: boolean): Promise<boolean>;
    checkAuthEntityNicknameAvailability(nickname: string, throwIfNotAvailable: boolean): Promise<boolean>;
    getAvailableAuthEntityId(): Promise<string>;
    getNewAuthEntity(email: string, nickname: string): Promise<EI.AuthEntity>;
    saveAuthEntity(authEntity: EI.AuthEntity, options?: SaveOptions): Promise<void>;
    updateAuthEntity(criteria: FindConditions<EI.AuthEntity>, partialEntity: QueryDeepPartialEntity<EI.AuthEntity>): Promise<void>;
    deleteAuthEntity(criteria: FindConditions<EI.AuthEntity>): Promise<void>;
    getAuthEntity(type: 'id' | 'email' | 'nickname', value: string): Promise<EI.AuthEntity>;
    sendTemporaryPasswordViaEmail(authEntity: EI.AuthEntity): Promise<void>;
    generateKey(): string;
    checkKey(key: string): void;
}
