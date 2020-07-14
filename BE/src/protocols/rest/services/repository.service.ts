import { Repository, getRepository } from 'typeorm';

import { FactoryExtension } from '../../common/extensions/factory.extension';
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
        super.set('AuthEntity', getRepository(EI.AuthEntity));
        super.set('UserEntity', getRepository(EI.UserEntity));
    }

}

export interface RepositoryServiceImplementation {
    AuthEntity: Repository<EI.AuthEntity>;
    UserEntity: Repository<EI.UserEntity>;
}
