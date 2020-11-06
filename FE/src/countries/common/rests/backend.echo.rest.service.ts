import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

import { BackendEchoRest } from 'countries/common/rests/backend.echo.rest';

@Injectable({
    providedIn: 'root'
})
export class BackendEchoRestService {

    constructor(
        private readonly backendEchoRest: BackendEchoRest
    ) { }

    public Echo(message: any): Observable<any> {
        return this.backendEchoRest.EchoPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuth(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

}
