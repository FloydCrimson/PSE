import { Repository, getRepository } from 'typeorm';

import * as EI from '../entities.index';

export class RepositoryService {

    private repositories: Map<any, Repository<any>>;

    constructor() {
        this.repositories = new Map<any, Repository<any>>();
        this.set('HawkEntity', getRepository(EI.HawkEntity));
        this.set('UserEntity', getRepository(EI.UserEntity));
    }

    public set<K extends keyof RepositoryServiceImplementation>(type: K, repository: Repository<RepositoryServiceImplementation[K]>): void {
        this.repositories.set(type, repository);
    }

    public get<K extends keyof RepositoryServiceImplementation>(type: K): Repository<RepositoryServiceImplementation[K]> {
        return this.repositories.get(type);
    }

}

export interface RepositoryServiceImplementation {
    HawkEntity: EI.HawkEntity;
    UserEntity: EI.UserEntity;
}
