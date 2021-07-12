import { Repository, getRepository } from 'typeorm';

import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { DispatcherService } from './dispatcher.service';

import * as EI from '../entities.index';

export class RepositoryService extends FactoryExtension<RepositoryServiceImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
        this.initialize();
    }

    private initialize(): void {
        for (const entity in EI) {
            super.set(entity as keyof RepositoryServiceImplementation, getRepository<any>(EI[entity]));
        }
    }

}

export interface RepositoryServiceImplementation {
    AuthEntity: Repository<EI.AuthEntity>;
    UserEntity: Repository<EI.UserEntity>;
}
