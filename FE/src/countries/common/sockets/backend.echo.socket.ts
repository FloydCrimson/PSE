import { Injectable } from '@angular/core';

import { SocketService } from 'global/services/socket.service';

import { SocketFactoryEndpoint } from '@countries/endpoints/socket-factory.endpoint';

@Injectable({
    providedIn: 'root'
})
export class BackendEchoSocket {

    constructor(
        private readonly socketService: SocketService,
    ) { }

    public EchoSEND(params: any) {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoSEND;
        const request = this.socketService.getMessage('Backend', endpoint);
        request.params = params;
        return this.socketService.send('Backend', endpoint, request);
    }

    public EchoRECEIVE() {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoRECEIVE;
        return this.socketService.receive('Backend', endpoint);
    }

}
