import { FindOneOptions } from 'typeorm';

import { CommunicationMethodImplementation } from '../../../global/common/implementations/communication.implementation';
import { RepositoryService } from './repository.service';
import * as EI from '../entities.index';

export class CommunicationService implements CommunicationServiceImplementation {

    constructor(
        private readonly repositoryService: RepositoryService
    ) { }

    async AuthEntityFindOne(params: { type: 'id' | 'email' | 'nickname'; value: string; options?: FindOneOptions<EI.AuthEntity> }): Promise<EI.AuthEntity> {
        return await this.repositoryService.get('AuthEntity').findOne({ [params.type]: params.value }, params.options);
    }

}

export interface CommunicationServiceImplementation {
    AuthEntityFindOne: CommunicationMethodImplementation<{ type: 'id' | 'email' | 'nickname'; value: string; }, EI.AuthEntity>;
}
