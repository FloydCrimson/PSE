import { DispatcherMethodImplementation } from '../../../global/common/implementations/dispatcher.implementation';

import { RepositoryService } from './repository.service';
import * as EI from '../entities.index';

export class DispatcherService implements DispatcherServiceImplementation {

    constructor(
        private readonly repositoryService: RepositoryService
    ) { }

    async AuthEntityFindOne(params: { type: 'id' | 'email' | 'nickname'; value: string; }): Promise<EI.AuthEntity> {
        return await this.repositoryService.get('AuthEntity').findOne({ [params.type]: params.value });
    }

}

export interface DispatcherServiceImplementation {
    AuthEntityFindOne: DispatcherMethodImplementation<{ type: 'id' | 'email' | 'nickname'; value: string; }, EI.AuthEntity>;
}
