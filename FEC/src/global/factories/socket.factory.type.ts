import { EndpointSocketImplementation } from 'global/common/implementations/endpoint-socket.implementation';

export interface SocketFactoryTypes {
    Backend: SocketFactoryTypeBackend;
}

export interface SocketFactoryTypeBackend {
    Echo: SocketFactoryTypeBackendEcho;
}

export interface SocketFactoryTypeBackendEcho {
    EchoSEND: EndpointSocketImplementation<any>;
    EchoRECEIVE: EndpointSocketImplementation<any>;
    EchoAuthSEND: EndpointSocketImplementation<any>;
    EchoAuthRECEIVE: EndpointSocketImplementation<any>;
}
