import { FindConditions, FindOneOptions } from 'typeorm';

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

}

export interface CommunicationServiceImplementation {
    AuthEntityFindOne: CommunicationMethodImplementation<(conditions?: FindConditions<EI.AuthEntity>, options?: FindOneOptions<EI.AuthEntity>) => Promise<EI.AuthEntity>>;
}
