import { EndpointRestImplementation } from 'global/common/implementations/endpoint-rest.implementation';

export interface RestFactoryTypes {
    Backend: RestFactoryTypeBackend;
}

//

export interface RestFactoryTypeBackend {
    Auth: RestFactoryTypeBackendAuth;
    Echo: RestFactoryTypeBackendEcho;
}

export interface RestFactoryTypeBackendAuth {
    EmailAvailablePOST: EndpointRestImplementation<{ email: string; }, undefined, { available: boolean; }>;
    NicknameAvailablePOST: EndpointRestImplementation<{ nickname: string; }, undefined, { available: boolean; }>;
    SignInPOST: EndpointRestImplementation<{ email: string; nickname: string; }>;
    SignOutPOST: EndpointRestImplementation;
    LogInPOST: EndpointRestImplementation<undefined, undefined, { authenticated: boolean; }>;
    LogOutPOST: EndpointRestImplementation;
    RecoverKeyPOST: EndpointRestImplementation<{ type: 'id' | 'email' | 'nickname'; value: string; }>;
    ChangeKeyPOST: EndpointRestImplementation<{ key: string; }>;
}

export interface RestFactoryTypeBackendEcho {
    EchoGET: EndpointRestImplementation<undefined, any, any>;
    EchoPOST: EndpointRestImplementation<any, undefined, any>;
    EchoAuthFullGET: EndpointRestImplementation<undefined, any, any>;
    EchoAuthFullPOST: EndpointRestImplementation<any, undefined, any>;
    EchoAuthFullCryptedGET: EndpointRestImplementation<undefined, any, any>;
    EchoAuthFullCryptedPOST: EndpointRestImplementation<any, undefined, any>;
    EchoAuthPartialGET: EndpointRestImplementation<undefined, any, any>;
    EchoAuthPartialPOST: EndpointRestImplementation<any, undefined, any>;
    EchoAuthPartialCryptedGET: EndpointRestImplementation<undefined, any, any>;
    EchoAuthPartialCryptedPOST: EndpointRestImplementation<any, undefined, any>;
}
