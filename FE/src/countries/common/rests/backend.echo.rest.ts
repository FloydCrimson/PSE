import { Injectable } from '@angular/core';

import { RestService } from 'global/services/rest.service';

import { RestFactoryEndpoint } from '@countries/endpoints/rest-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendEchoRest {

    constructor(
        private readonly restService: RestService,
    ) { }

    public Echo(params: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.Echo;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.params = params;
        return this.restService.call('Backend', endpoint, request);
    }

}
