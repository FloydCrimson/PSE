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

    public EmailAvailablePOST(body: { email: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.EmailAvailablePOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public NicknameAvailablePOST(body: { nickname: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.NicknameAvailablePOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public SignInPOST(body: { email: string; nickname: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.SignInPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public LogInPOST() {
        const endpoint = RestFactoryEndpoint.Backend.Auth.LogInPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public LogOutPOST() {
        const endpoint = RestFactoryEndpoint.Backend.Auth.LogOutPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public RecoverKeyPOST(body: { type: 'id' | 'email' | 'nickname'; value: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.RecoverKeyPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

    public ChangeKeyPOST(body: { key: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.ChangeKeyPOST;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = body;
        return this.restService.makeCall('Backend', endpoint, request);
    }

}
