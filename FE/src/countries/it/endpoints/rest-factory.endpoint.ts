import * as RestFT from 'global/factories/rest.factory.type';

const TIMEOUT = 30000;

class BackendEndpoint implements RestFT.RestFactoryTypeBackend {
    Auth = new BackendAuthEndpoint();
    Echo = new BackendEchoEndpoint();
}

class BackendAuthEndpoint implements RestFT.RestFactoryTypeBackendAuth {
    EmailAvailablePOST = { auth: 'none', timeout: TIMEOUT, method: 'POST', url: '/auth/email-available' } as RestFT.RestFactoryTypeBackendAuth['EmailAvailablePOST'];
    NicknameAvailablePOST = { auth: 'none', timeout: TIMEOUT, method: 'POST', url: '/auth/nickname-available' } as RestFT.RestFactoryTypeBackendAuth['NicknameAvailablePOST'];
    SignInPOST = { auth: 'none', timeout: TIMEOUT, method: 'POST', url: '/auth/sign-in' } as RestFT.RestFactoryTypeBackendAuth['SignInPOST'];
    SignOutPOST = { auth: 'full', timeout: TIMEOUT, method: 'POST', url: '/auth/sign-out' } as RestFT.RestFactoryTypeBackendAuth['SignOutPOST'];
    LogInPOST = { auth: 'full', timeout: TIMEOUT, method: 'POST', url: '/auth/log-in' } as RestFT.RestFactoryTypeBackendAuth['LogInPOST'];
    LogOutPOST = { auth: 'full', timeout: TIMEOUT, method: 'POST', url: '/auth/log-out' } as RestFT.RestFactoryTypeBackendAuth['LogOutPOST'];
}

class BackendEchoEndpoint implements RestFT.RestFactoryTypeBackendEcho {
    EchoGET = { auth: 'none', timeout: TIMEOUT, method: 'GET', url: '/echo/echo' } as RestFT.RestFactoryTypeBackendEcho['EchoGET'];
    EchoPOST = { auth: 'none', timeout: TIMEOUT, method: 'POST', url: '/echo/echo' } as RestFT.RestFactoryTypeBackendEcho['EchoPOST'];
    EchoAuthGET = { auth: 'full', timeout: TIMEOUT, method: 'GET', url: '/echo/echo-auth' } as RestFT.RestFactoryTypeBackendEcho['EchoAuthGET'];
    EchoAuthPOST = { auth: 'full', timeout: TIMEOUT, method: 'POST', url: '/echo/echo-auth' } as RestFT.RestFactoryTypeBackendEcho['EchoAuthPOST'];
}

export const RestFactoryEndpoint: RestFT.RestFactoryTypes = {
    Backend: new BackendEndpoint()
}
