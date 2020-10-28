import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, of } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

import { StorageFactory } from 'global/factories/storage.factory';
// import { SocketService } from 'global/services/socket.service';

import { BackendAuthRest } from 'countries/common/rests/backend.auth.rest';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor(
        private readonly storageFactory: StorageFactory,
        // private readonly socketService: SocketService,
        private readonly backendAuthRest: BackendAuthRest
    ) { }

    public login(auth: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; }): Observable<boolean> {
        this.storageFactory.get('TempInData').set('auth', auth);
        return this.backendAuthRest.LogInPOST(undefined).pipe(
            exhaustMap((result) => {
                const methods = result.success ?
                    [
                        from(this.storageFactory.get('PersOutData').set('authenticated', true)),
                        from(this.storageFactory.get('PersOutData').set('auth', { type: auth.type, value: auth.value })),
                        of(this.storageFactory.get('TempOutData').set('logged', true))//,
                        // this.socketService.open('Backend')
                    ] : [
                        of(this.storageFactory.get('TempInData').clear())
                    ];
                return forkJoin(methods).pipe(
                    map(_ => result.success)
                );
            })
        );
    }

    public logout(): Observable<boolean> {
        return this.backendAuthRest.LogOutPOST(undefined).pipe(
            exhaustMap((result) => {
                const methods =
                    [
                        of(this.storageFactory.get('TempInData').clear()),
                        of(this.storageFactory.get('TempOutData').set('logged', false))//,
                        // this.socketService.close('Backend') // TODO: to check why on socket close the servers freeze, both rest and socket
                    ];
                return forkJoin(methods).pipe(
                    map(_ => result.success)
                );
            })
        );
    }

}
