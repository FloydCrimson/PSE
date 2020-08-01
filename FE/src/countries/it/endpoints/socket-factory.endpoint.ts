import * as SocketFT from 'global/factories/socket.factory.type';

class BackendEndpoint implements SocketFT.SocketFactoryTypeBackend {
    Echo = new BackendEchoEndpoint();
}

class BackendEchoEndpoint implements SocketFT.SocketFactoryTypeBackendEcho {
    EchoSEND = { auth: false, operation: '/echo/echo' } as SocketFT.SocketFactoryTypeBackendEcho['EchoSEND'];
    EchoRECEIVE = { auth: false, operation: '/echo/echo' } as SocketFT.SocketFactoryTypeBackendEcho['EchoRECEIVE'];
    EchoAuthSEND = { auth: true, operation: '/echo/echo-auth' } as SocketFT.SocketFactoryTypeBackendEcho['EchoAuthSEND'];
    EchoAuthRECEIVE = { auth: true, operation: '/echo/echo-auth' } as SocketFT.SocketFactoryTypeBackendEcho['EchoAuthRECEIVE'];
}

export const SocketFactoryEndpoint: SocketFT.SocketFactoryTypes = {
    Backend: new BackendEndpoint()
}
