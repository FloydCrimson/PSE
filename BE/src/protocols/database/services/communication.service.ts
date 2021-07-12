import { DeleteResult, FindConditions, FindOneOptions, SaveOptions, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { DispatcherService } from './dispatcher.service';

import * as EI from '../entities.index';

export class CommunicationService {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async AuthEntityFindOne(conditions?: FindConditions<EI.AuthEntity>, options?: FindOneOptions<EI.AuthEntity>): Promise<EI.AuthEntity> {
        return await this.dispatcherService.get('RepositoryService').get('AuthEntity').findOne(conditions, options);
    }

    public async AuthEntitySave(authEntity: EI.AuthEntity, options?: SaveOptions): Promise<EI.AuthEntity> {
        return await this.dispatcherService.get('RepositoryService').get('AuthEntity').save(authEntity, options);
    }

    public async AuthEntityUpdate(criteria: FindConditions<EI.AuthEntity>, partialEntity: QueryDeepPartialEntity<EI.AuthEntity>): Promise<UpdateResult> {
        return await this.dispatcherService.get('RepositoryService').get('AuthEntity').update(criteria, partialEntity);
    }

    public async AuthEntityDelete(criteria: FindConditions<EI.AuthEntity>): Promise<DeleteResult> {
        return await this.dispatcherService.get('RepositoryService').get('AuthEntity').delete(criteria);
    }

}
