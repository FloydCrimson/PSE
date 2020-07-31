import { Injectable } from '@angular/core';
import { from, forkJoin } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

import { RestService } from 'global/services/rest.service';
import { SocketService } from 'global/services/socket.service';
import { StorageFactory } from 'global/factories/storage.factory';

import { RestFactoryEndpoint } from '@countries/endpoints/rest-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendAuthRest {

    constructor(
        private readonly restService: RestService,
        private readonly socketService: SocketService,
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
                if (result.success) {
                    return forkJoin(
                        from(this.storageFactory.get('TempOutData').set('logged', true)),
                        this.socketService.open('Backend')
                    ).pipe(
                        map(_ => result)
                    );
                } else {
                    return from(this.storageFactory.get('TempInData').clear()).pipe(
                        map(_ => result)
                    );
                }
            })
        );
    }

    public LogOut() {
        const endpoint = RestFactoryEndpoint.Backend.Auth.LogOut;
        const request = this.restService.getRequest('Backend', endpoint);
        return this.restService.call('Backend', endpoint, request).pipe(
            exhaustMap((result) => {
                return forkJoin(
                    from(this.storageFactory.get('TempInData').clear()),
                    from(this.storageFactory.get('TempOutData').set('logged', false)),
                    this.socketService.close('Backend')
                ).pipe(
                    map(_ => result)
                );
            })
        );
    }

}
