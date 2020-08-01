import * as RestFT from 'global/factories/rest.factory.type';

class BackendEndpoint implements RestFT.RestFactoryTypeBackend {
    Auth = new BackendAuthEndpoint();
    Echo = new BackendEchoEndpoint();
}

class BackendAuthEndpoint implements RestFT.RestFactoryTypeBackendAuth {
    EmailAvailablePOST = { auth: false, timeout: 10000, method: 'POST', url: '/auth/email-available' } as RestFT.RestFactoryTypeBackendAuth['EmailAvailablePOST'];
    NicknameAvailablePOST = { auth: false, timeout: 10000, method: 'POST', url: '/auth/nickname-available' } as RestFT.RestFactoryTypeBackendAuth['NicknameAvailablePOST'];
    SignInPOST = { auth: false, timeout: 10000, method: 'POST', url: '/auth/sign-in' } as RestFT.RestFactoryTypeBackendAuth['SignInPOST'];
    SignOutPOST = { auth: true, timeout: 10000, method: 'POST', url: '/auth/sign-out' } as RestFT.RestFactoryTypeBackendAuth['SignOutPOST'];
    LogInPOST = { auth: true, timeout: 10000, method: 'POST', url: '/auth/log-in' } as RestFT.RestFactoryTypeBackendAuth['LogInPOST'];
    LogOutPOST = { auth: true, timeout: 10000, method: 'POST', url: '/auth/log-out' } as RestFT.RestFactoryTypeBackendAuth['LogOutPOST'];
}

class BackendEchoEndpoint implements RestFT.RestFactoryTypeBackendEcho {
    EchoGET = { auth: false, timeout: 10000, method: 'GET', url: '/echo/echo' } as RestFT.RestFactoryTypeBackendEcho['EchoGET'];
    EchoPOST = { auth: false, timeout: 10000, method: 'POST', url: '/echo/echo' } as RestFT.RestFactoryTypeBackendEcho['EchoPOST'];
    EchoAuthGET = { auth: true, timeout: 10000, method: 'GET', url: '/echo/echo-auth' } as RestFT.RestFactoryTypeBackendEcho['EchoAuthGET'];
    EchoAuthPOST = { auth: true, timeout: 10000, method: 'POST', url: '/echo/echo-auth' } as RestFT.RestFactoryTypeBackendEcho['EchoAuthPOST'];
}

export const RestFactoryEndpoint: RestFT.RestFactoryTypes = {
    Backend: new BackendEndpoint()
}
