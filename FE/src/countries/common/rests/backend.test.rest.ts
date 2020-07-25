import { RestFactory } from 'global/factories/rest.factory';
import { RequestRestImplementation } from 'global/common/implementations/request-rest.implementation';

import { RestFactoryEndpoint } from '@countries/endpoints/rest-factory.endpoint';

export class BackendAuthRest {

    constructor(
        private readonly restFactory: RestFactory
    ) { }

    public backendTestEcho(input: { body: undefined, params: { [key: string]: string; } }) {
        const request: RequestRestImplementation<undefined, { [key: string]: string; }> = { input, options: { cached: false, wait: true } };
        return this.restFactory.get('Backend').call(RestFactoryEndpoint.Backend.Echo.Echo, request);
    }

}
