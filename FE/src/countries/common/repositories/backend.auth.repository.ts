import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

import { RepositoryService } from 'global/services/repository.service';
import { StorageFactory } from 'global/factories/storage.factory';

import { RepositoryFactoryEndpoint } from '@countries/endpoints/repository-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendAuthRepository {

    constructor(
        private readonly repositoryService: RepositoryService,
        private readonly storageFactory: StorageFactory
    ) { }

    public EmailAvailable(params: { email: string; }) {
        const endpoint = RepositoryFactoryEndpoint.Backend.Auth.EmailAvailable;
        const request = this.repositoryService.getRequest('Backend', endpoint);
        request.input.body = params;
        return this.repositoryService.call('Backend', endpoint, request);
    }

    public NicknameAvailable(params: { nickname: string; }) {
        const endpoint = RepositoryFactoryEndpoint.Backend.Auth.NicknameAvailable;
        const request = this.repositoryService.getRequest('Backend', endpoint);
        request.input.body = params;
        return this.repositoryService.call('Backend', endpoint, request);
    }

    public SignIn(params: { email: string; nickname: string; password: string; }) {
        const endpoint = RepositoryFactoryEndpoint.Backend.Auth.SignIn;
        const request = this.repositoryService.getRequest('Backend', endpoint);
        request.input.body = params;
        return this.repositoryService.call('Backend', endpoint, request);
    }

    public LogIn(params: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; }) {
        const endpoint = RepositoryFactoryEndpoint.Backend.Auth.LogIn;
        const request = this.repositoryService.getRequest('Backend', endpoint);
        return from(this.storageFactory.get('TempInData').set('auth', params)).pipe(
            exhaustMap(_ => this.repositoryService.call('Backend', endpoint, request)),
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
