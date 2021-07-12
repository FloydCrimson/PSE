import { Injectable } from '@angular/core';

import { SocketService } from 'global/services/socket.service';

import { SocketFactoryEndpoint } from '@countries/endpoints/socket/socket-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendEchoSocket {

    constructor(
        private readonly socketService: SocketService,
    ) {
        this.initialize();
    }

    private initialize(): void {
        this.EchoRECEIVESubscription();
        this.EchoAuthRECEIVESubscription();
    }

    // SEND

    public EchoSEND(params: any) {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoSEND;
        const request = this.socketService.getMessage('Backend', endpoint);
        request.params = params;
        return this.socketService.send('Backend', endpoint, request);
    }

    public EchoAuthSEND(params: any) {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoAuthSEND;
        const request = this.socketService.getMessage('Backend', endpoint);
        request.params = params;
        return this.socketService.send('Backend', endpoint, request);
    }

    // RECEIVE

    public EchoRECEIVE() {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoRECEIVE;
        return this.socketService.receive('Backend', endpoint);
    }

    public EchoAuthRECEIVE() {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoAuthRECEIVE;
        return this.socketService.receive('Backend', endpoint);
    }

    // SUBSCRIPTION

    private EchoRECEIVESubscription() {
        return this.EchoRECEIVE().subscribe((response) => {
            console.log('BackendEchoSocketSubscription.EchoRECEIVESubscription', response);
        });
    }

    private EchoAuthRECEIVESubscription() {
        return this.EchoAuthRECEIVE().subscribe((response) => {
            console.log('BackendEchoSocketSubscription.EchoAuthRECEIVESubscription', response);
        });
    }

}
