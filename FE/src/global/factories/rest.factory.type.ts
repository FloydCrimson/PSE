import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';

export interface RestFactoryTypes {
    Backend: RestFactoryTypeBackend;
}

export interface RestFactoryTypeBackend {
    Auth: RestFactoryTypeBackendAuth;
    Echo: RestFactoryTypeBackendEcho;
}

export interface RestFactoryTypeBackendAuth {
    EmailAvailable: EndpointRestImplementation<{ email: string; }, undefined, { email: boolean; }>;
    NicknameAvailable: EndpointRestImplementation<{ nickname: string; }, undefined, { nickname: boolean; }>;
    SignIn: EndpointRestImplementation<{ email: string; nickname: string; password: string; }, undefined, { email: boolean; nickname: boolean; success: boolean; }>;
    SignOut: EndpointRestImplementation<undefined, undefined, undefined>;
    LogIn: EndpointRestImplementation<undefined, undefined, undefined>;
    LogOut: EndpointRestImplementation<undefined, undefined, undefined>;
}

export interface RestFactoryTypeBackendEcho {
    Echo: EndpointRestImplementation<undefined, any, any>;
}
