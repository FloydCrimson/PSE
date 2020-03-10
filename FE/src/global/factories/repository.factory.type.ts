import { EndpointImplementation } from 'global/common/implementations/endpoint.implementation';

export interface RepositoryFactoryTypes {
    Backend: RepositoryFactoryTypeBackend;
}

export interface RepositoryFactoryTypeBackend {
    Auth: RepositoryFactoryTypeBackendAuth;
    Echo: RepositoryFactoryTypeBackendEcho;
    Test: RepositoryFactoryTypeBackendTest;
}

export interface RepositoryFactoryTypeBackendAuth {
    EmailAvailable: EndpointImplementation<{ email: string; }, undefined, { email: boolean; }>;
    NicknameAvailable: EndpointImplementation<{ nickname: string; }, undefined, { nickname: boolean; }>;
    SignIn: EndpointImplementation<{ email: string; nickname: string; password: string; }, undefined, { email: boolean; nickname: boolean; success: boolean; }>;
    SignOut: EndpointImplementation<undefined, undefined, undefined>;
    LogIn: EndpointImplementation<undefined, undefined, undefined>;
    LogOut: EndpointImplementation<undefined, undefined, undefined>;
}

export interface RepositoryFactoryTypeBackendEcho {
    Echo: EndpointImplementation<undefined, { [key: string]: string }, { [key: string]: string }>;
}

export interface RepositoryFactoryTypeBackendTest {
    Test: EndpointImplementation<undefined, undefined, undefined>;
}
