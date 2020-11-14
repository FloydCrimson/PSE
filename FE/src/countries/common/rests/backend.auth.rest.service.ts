import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

import { PersistentStorageFactory } from 'global/factories/persistent-storages.factory';
import { EphemeralStorageFactory } from 'global/factories/ephemeral-storages.factory';
// import { SocketService } from 'global/services/socket.service';

import { BackendAuthRest } from 'countries/common/rests/backend.auth.rest';

@Injectable({
    providedIn: 'root'
})
export class BackendAuthRestService {

    constructor(
        private readonly pStorageFactory: PersistentStorageFactory,
        private readonly eStorageFactory: EphemeralStorageFactory,
        // private readonly socketService: SocketService,
        private readonly backendAuthRest: BackendAuthRest
    ) { }

    public SignIn(email: string, nickname: string): Observable<void> {
        return this.backendAuthRest.SignInPOST({ email, nickname }).pipe(
            exhaustMap((result) => result.success ? of(undefined) : throwError(result.error))
        );
    }

    public LogIn(auth: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; }): Observable<{ authenticated: boolean; }> {
        this.eStorageFactory.get('In').set('auth', auth);
        return this.backendAuthRest.LogInPOST().pipe(
            exhaustMap((result) => {
                if (result.success) {
                    return from((async () => {
                        await this.pStorageFactory.get('Local').set('authenticated', true);
                        await this.pStorageFactory.get('Local').set('auth', { type: auth.type, value: auth.value });
                        this.eStorageFactory.get('Out').set('logged', true);
                        // await this.socketService.open('Backend').toPromise();
                    })()).pipe(
                        exhaustMap(_ => of(result.response.output))
                    );
                } else {
                    return from((async () => {
                        this.eStorageFactory.get('Out').set('logged', false);
                        this.eStorageFactory.get('In').clear();
                    })()).pipe(
                        exhaustMap(_ => throwError(result.error))
                    );
                }
            })
        );
    }

    public LogOut(): Observable<void> {
        return this.backendAuthRest.LogOutPOST().pipe(
            exhaustMap(_ => {
                return from((async () => {
                    this.eStorageFactory.get('Out').set('logged', false);
                    this.eStorageFactory.get('In').clear();
                    // await this.socketService.close('Backend').toPromise();
                })()).pipe(
                    exhaustMap(_ => of(undefined))
                );
            })
        );
    }

    public ChangeKey(key: string): Observable<void> {
        return this.backendAuthRest.ChangeKeyPOST({ key }).pipe(
            exhaustMap((result) => {
                if (result.success) {
                    return from((async () => {
                        const auth = this.eStorageFactory.get('In').get('auth');
                        auth.key = key;
                        this.eStorageFactory.get('In').set('auth', auth);
                    })()).pipe(
                        exhaustMap(_ => of(undefined))
                    );
                } else {
                    return throwError(result.error);
                }
            })
        );
    }

}
