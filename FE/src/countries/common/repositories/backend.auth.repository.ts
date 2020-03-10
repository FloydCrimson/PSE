import { RepositoryFactory } from 'global/factories/repository.factory';
import { RequestImplementation } from 'global/common/implementations/request.implementation';

import { RepositoryFactoryEndpoint } from '@countries/endpoints/repository-factory.endpoint';

export class BackendAuthRepository {

    constructor(
        private readonly repositoryFactory: RepositoryFactory
    ) { }

    public backendAuthLogin() {
        const request: RequestImplementation<undefined, undefined> = { input: undefined, options: { cached: false, wait: true } };
        return this.repositoryFactory.get('Backend').call(RepositoryFactoryEndpoint.Backend.Auth.LogIn, request);
    }

}
