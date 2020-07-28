import * as SocketFT from 'global/factories/socket.factory.type';

class BackendEndpoint implements SocketFT.SocketFactoryTypeBackend {
    Echo = new BackendEchoEndpoint();
}

class BackendEchoEndpoint implements SocketFT.SocketFactoryTypeBackendEcho {
    EchoSend = { auth: false, operation: 'echo' } as SocketFT.SocketFactoryTypeBackendEcho['EchoSend'];
    EchoReceive = { auth: false, operation: 'echo' } as SocketFT.SocketFactoryTypeBackendEcho['EchoReceive'];
}

export const SocketFactoryEndpoint: SocketFT.SocketFactoryTypes = {
    Backend: new BackendEndpoint()
}
