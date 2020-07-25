import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

import { RestService } from 'global/services/rest.service';
import { StorageFactory } from 'global/factories/storage.factory';

import { RestFactoryEndpoint } from '@countries/endpoints/rest-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendAuthRest {

    constructor(
        private readonly restService: RestService,
        private readonly storageFactory: StorageFactory
    ) { }

    public EmailAvailable(params: { email: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.EmailAvailable;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = params;
        return this.restService.call('Backend', endpoint, request);
    }

    public NicknameAvailable(params: { nickname: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.NicknameAvailable;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = params;
        return this.restService.call('Backend', endpoint, request);
    }

    public SignIn(params: { email: string; nickname: string; password: string; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.SignIn;
        const request = this.restService.getRequest('Backend', endpoint);
        request.input.body = params;
        return this.restService.call('Backend', endpoint, request);
    }

    public LogIn(params: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; }) {
        const endpoint = RestFactoryEndpoint.Backend.Auth.LogIn;
        const request = this.restService.getRequest('Backend', endpoint);
        return from(this.storageFactory.get('TempInData').set('auth', params)).pipe(
            exhaustMap(_ => this.restService.call('Backend', endpoint, request)),
            exhaustMap((result) => {
                if (result.success === false) {
                    return from(this.storageFactory.get('TempInData').remove('auth')).pipe(
                        map(_ => result)
                    );
                }
                return of(result);
            })
        );
    }

}
