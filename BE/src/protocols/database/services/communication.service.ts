import { DeleteResult, FindConditions, FindOneOptions, SaveOptions, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CommunicationMethodImplementation } from '../../../global/common/implementations/communication.implementation';
import { RepositoryService } from './repository.service';
import * as EI from '../entities.index';

export class CommunicationService implements CommunicationServiceImplementation {

    constructor(
        private readonly repositoryService: RepositoryService
    ) { }

    public async AuthEntityFindOne(conditions?: FindConditions<EI.AuthEntity>, options?: FindOneOptions<EI.AuthEntity>): Promise<EI.AuthEntity> {
        return await this.repositoryService.get('AuthEntity').findOne(conditions, options);
    }

    public async AuthEntitySave(authEntity: EI.AuthEntity, options?: SaveOptions): Promise<EI.AuthEntity> {
        return await this.repositoryService.get('AuthEntity').save(authEntity, options);
    }

    public async AuthEntityUpdate(criteria: FindConditions<EI.AuthEntity>, partialEntity: QueryDeepPartialEntity<EI.AuthEntity>): Promise<UpdateResult> {
        return await this.repositoryService.get('AuthEntity').update(criteria, partialEntity);
    }

    public async AuthEntityDelete(criteria: FindConditions<EI.AuthEntity>): Promise<DeleteResult> {
        return await this.repositoryService.get('AuthEntity').delete(criteria);
    }

}

export interface CommunicationServiceImplementation {
    AuthEntityFindOne: CommunicationMethodImplementation<(conditions?: FindConditions<EI.AuthEntity>, options?: FindOneOptions<EI.AuthEntity>) => Promise<EI.AuthEntity>>;
    AuthEntitySave: CommunicationMethodImplementation<(authEntity: EI.AuthEntity, options?: SaveOptions) => Promise<EI.AuthEntity>>;
    AuthEntityUpdate: CommunicationMethodImplementation<(criteria: FindConditions<EI.AuthEntity>, partialEntity: QueryDeepPartialEntity<EI.AuthEntity>) => Promise<UpdateResult>>;
    AuthEntityDelete: CommunicationMethodImplementation<(criteria: FindConditions<EI.AuthEntity>) => Promise<DeleteResult>>;
}
