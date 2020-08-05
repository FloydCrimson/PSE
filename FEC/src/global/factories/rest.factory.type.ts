import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';

export interface RestFactoryTypes {
    Backend: RestFactoryTypeBackend;
}

export interface RestFactoryTypeBackend {
    Auth: RestFactoryTypeBackendAuth;
    Echo: RestFactoryTypeBackendEcho;
}

export interface RestFactoryTypeBackendAuth {
    EmailAvailablePOST: EndpointRestImplementation<{ email: string; }, undefined, { email: boolean; }>;
    NicknameAvailablePOST: EndpointRestImplementation<{ nickname: string; }, undefined, { nickname: boolean; }>;
    SignInPOST: EndpointRestImplementation<{ email: string; nickname: string; password: string; }, undefined, { email: boolean; nickname: boolean; success: boolean; }>;
    SignOutPOST: EndpointRestImplementation<undefined, undefined, undefined>;
    LogInPOST: EndpointRestImplementation<undefined, undefined, undefined>;
    LogOutPOST: EndpointRestImplementation<undefined, undefined, undefined>;
}

export interface RestFactoryTypeBackendEcho {
    EchoGET: EndpointRestImplementation<undefined, any, any>;
    EchoPOST: EndpointRestImplementation<any, undefined, any>;
    EchoAuthGET: EndpointRestImplementation<undefined, any, any>;
    EchoAuthPOST: EndpointRestImplementation<any, undefined, any>;
}
