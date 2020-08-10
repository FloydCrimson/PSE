import { Injectable } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageFactory } from 'global/factories/storage.factory';

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor(
        private readonly storageFactory: StorageFactory
    ) { }

    public login(): Observable<boolean> {
        return forkJoin(
            from(this.storageFactory.get('PersOutData').set('authenticated', true)),
            from(this.storageFactory.get('TempOutData').set('logged', true))
        ).pipe(
            map(_ => true)
        );
    }

    public logout(): Observable<boolean> {
        return forkJoin(
            from(this.storageFactory.get('TempInData').clear()),
            from(this.storageFactory.get('TempOutData').set('logged', false))
        ).pipe(
            map(_ => true)
        );
    }

}
