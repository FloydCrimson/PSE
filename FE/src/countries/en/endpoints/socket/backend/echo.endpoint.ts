import * as SocketFT from 'global/factories/socket.factory.type';

export const BackendEchoEndpoint: SocketFT.SocketFactoryTypeBackendEcho = {
    // /echo/echo
    EchoSEND: {
        operation: '/echo/echo',
        auth: false
    },
    EchoRECEIVE: {
        operation: '/echo/echo',
        auth: false
    },
    // /echo/echo-auth
    EchoAuthSEND: {
        operation: '/echo/echo-auth',
        auth: true
    },
    EchoAuthRECEIVE: {
        operation: '/echo/echo-auth',
        auth: true
    }
};
