import { EndpointSocketImplementation } from 'global/common/implementations/endpoint-socket.implementation';

export interface SocketFactoryTypes {
    Backend: SocketFactoryTypeBackend;
}

export interface SocketFactoryTypeBackend {
    Echo: SocketFactoryTypeBackendEcho;
}

export interface SocketFactoryTypeBackendEcho {
    Echo: EndpointSocketImplementation<{ [key: string]: string }>;
}
