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

    public EchoGET(message: any): Observable<any> {
        return this.backendEchoRest.EchoGET(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoPOST(message: any): Observable<any> {
        return this.backendEchoRest.EchoPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthFullGET(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthFullGET(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthFullPOST(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthFullPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthFullCryptedGET(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthFullCryptedGET(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthFullCryptedPOST(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthFullCryptedPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthPartialGET(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthPartialGET(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthPartialPOST(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthPartialPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthPartialCryptedGET(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthPartialCryptedGET(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

    public EchoAuthPartialCryptedPOST(message: any): Observable<any> {
        return this.backendEchoRest.EchoAuthPartialCryptedPOST(message).pipe(
            exhaustMap((result) => result.success ? of(result.response.output) : throwError(result.error))
        );
    }

}
