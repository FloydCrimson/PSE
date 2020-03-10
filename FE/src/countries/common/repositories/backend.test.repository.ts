import { RepositoryFactory } from 'global/factories/repository.factory';
import { RequestImplementation } from 'global/common/implementations/request.implementation';

import { RepositoryFactoryEndpoint } from '@countries/endpoints/repository-factory.endpoint';

export class BackendAuthRepository {

    constructor(
        private readonly repositoryFactory: RepositoryFactory
    ) { }

    public backendTestEcho(input: { body: undefined, params: { [key: string]: string; } }) {
        const request: RequestImplementation<undefined, { [key: string]: string; }> = { input, options: { cached: false, wait: true } };
        return this.repositoryFactory.get('Backend').call(RepositoryFactoryEndpoint.Backend.Echo.Echo, request);
    }

}
