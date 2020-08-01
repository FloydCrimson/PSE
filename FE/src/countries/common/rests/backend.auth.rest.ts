import { Injectable } from '@angular/core';

import { RestService } from 'global/services/rest.service';

import { RestFactoryEndpoint } from '@countries/endpoints/rest-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendAuthRest {

    constructor(
        private readonly restService: RestService
    ) { }

    public EmailAvailablePOST(body: { email: string; }, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.EmailAvailablePOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input = { body, params };
        return this.restService.call('Backend', endpoint, request);
    }

    public NicknameAvailablePOST(body: { nickname: string; }, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.NicknameAvailablePOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input = { body, params };
        return this.restService.call('Backend', endpoint, request);
    }

    public SignInPOST(body: { email: string; nickname: string; password: string; }, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.SignInPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input = { body, params };
        return this.restService.call('Backend', endpoint, request);
    }

    public LogInPOST(body: undefined, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.LogInPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        return this.restService.call('Backend', endpoint, request);
    }

    public LogOutPOST(body: undefined, params?: undefined) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.LogOutPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        return this.restService.call('Backend', endpoint, request);
    }

}
