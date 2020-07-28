import * as RestFT from 'global/factories/rest.factory.type';

class BackendEndpoint implements RestFT.RestFactoryTypeBackend {
    Auth = new BackendAuthEndpoint();
    Echo = new BackendEchoEndpoint();
}

class BackendAuthEndpoint implements RestFT.RestFactoryTypeBackendAuth {
    EmailAvailable = { auth: false, timeout: 10000, method: 'POST', url: '/auth/emailAvailable' } as RestFT.RestFactoryTypeBackendAuth['EmailAvailable'];
    NicknameAvailable = { auth: false, timeout: 10000, method: 'POST', url: '/auth/nicknameAvailable' } as RestFT.RestFactoryTypeBackendAuth['NicknameAvailable'];
    SignIn = { auth: false, timeout: 10000, method: 'POST', url: '/auth/signin' } as RestFT.RestFactoryTypeBackendAuth['SignIn'];
    SignOut = { auth: true, timeout: 10000, method: 'POST', url: '/auth/signout' } as RestFT.RestFactoryTypeBackendAuth['SignOut'];
    LogIn = { auth: true, timeout: 10000, method: 'POST', url: '/auth/login' } as RestFT.RestFactoryTypeBackendAuth['LogIn'];
    LogOut = { auth: true, timeout: 10000, method: 'POST', url: '/auth/logout' } as RestFT.RestFactoryTypeBackendAuth['LogOut'];
}

class BackendEchoEndpoint implements RestFT.RestFactoryTypeBackendEcho {
    Echo = { auth: false, timeout: 10000, method: 'GET', url: '/echo' } as RestFT.RestFactoryTypeBackendEcho['Echo'];
}

export const RestFactoryEndpoint: RestFT.RestFactoryTypes = {
    Backend: new BackendEndpoint()
}
