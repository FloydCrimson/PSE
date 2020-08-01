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

    public EchoGET(params: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoGET;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.params = params;
        return this.restService.call('Backend', endpoint, request);
    }

    public EchoPOST(body: any, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.call('Backend', endpoint, request);
    }

    public EchoAuthGET(params: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoAuthGET;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.params = params;
        return this.restService.call('Backend', endpoint, request);
    }

    public EchoAuthPOST(body: any, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoAuthPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.call('Backend', endpoint, request);
    }

}
