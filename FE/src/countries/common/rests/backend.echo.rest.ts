import { Injectable } from '@angular/core';

import { RestService } from 'global/services/rest.service';

import { RestFactoryEndpoint } from '@countries/endpoints/rest/rest-factory.endpoint';

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
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public EchoPOST(body: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public EchoAuthFullGET(params: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoAuthFullGET;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.params = params;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public EchoAuthFullPOST(body: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoAuthFullPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public EchoAuthPartialGET(params: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoAuthPartialGET;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.params = params;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public EchoAuthPartialPOST(body: any) {
        const endpoint = RestFactoryEndpoint.Backend.Echo.EchoAuthPartialPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

}
