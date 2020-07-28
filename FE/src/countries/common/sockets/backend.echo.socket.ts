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

    public EchoSend(params: any) {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoSend;
        const request = this.socketService.getMessage('Backend', endpoint);
        request.params = params;
        return this.socketService.send('Backend', endpoint, request);
    }

    public EchoReceive() {
        const endpoint = SocketFactoryEndpoint.Backend.Echo.EchoReceive;
        return this.socketService.receive('Backend', endpoint);
    }

}
