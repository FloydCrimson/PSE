import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';

export interface RestFactoryTypes {
    Backend: RestFactoryTypeBackend;
}

export interface RestFactoryTypeBackend {
    Auth: RestFactoryTypeBackendAuth;
    Echo: RestFactoryTypeBackendEcho;
}

export interface RestFactoryTypeBackendAuth {
    EmailAvailablePOST: EndpointRestImplementation<{ email: string; }, undefined, { available: boolean; }>;
    NicknameAvailablePOST: EndpointRestImplementation<{ nickname: string; }, undefined, { available: boolean; }>;
    SignInPOST: EndpointRestImplementation<{ email: string; nickname: string; }, undefined, { success: boolean; }>;
    SignOutPOST: EndpointRestImplementation;
    LogInPOST: EndpointRestImplementation;
    LogOutPOST: EndpointRestImplementation;
}

export interface RestFactoryTypeBackendEcho {
    EchoGET: EndpointRestImplementation<undefined, any, any>;
    EchoPOST: EndpointRestImplementation<any, undefined, any>;
    EchoAuthGET: EndpointRestImplementation<undefined, any, any>;
    EchoAuthPOST: EndpointRestImplementation<any, undefined, any>;
}
