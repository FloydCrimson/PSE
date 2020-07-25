import * as RFT from 'global/factories/rest.factory.type';

class BackendEndpoint implements RFT.RestFactoryTypeBackend {
    Auth = new BackendAuthEndpoint();
    Echo = new BackendEchoEndpoint();
    Test = new BackendTestEndpoint();
}

class BackendAuthEndpoint implements RFT.RestFactoryTypeBackendAuth {
    EmailAvailable = { auth: false, timeout: 10000, method: 'POST', url: '/auth/emailAvailable' } as RFT.RestFactoryTypeBackendAuth['EmailAvailable'];
    NicknameAvailable = { auth: false, timeout: 10000, method: 'POST', url: '/auth/nicknameAvailable' } as RFT.RestFactoryTypeBackendAuth['NicknameAvailable'];
    SignIn = { auth: false, timeout: 10000, method: 'POST', url: '/auth/signin' } as RFT.RestFactoryTypeBackendAuth['SignIn'];
    SignOut = { auth: true, timeout: 10000, method: 'POST', url: '/auth/signout' } as RFT.RestFactoryTypeBackendAuth['SignOut'];
    LogIn = { auth: true, timeout: 10000, method: 'POST', url: '/auth/login' } as RFT.RestFactoryTypeBackendAuth['LogIn'];
    LogOut = { auth: true, timeout: 10000, method: 'POST', url: '/auth/logout' } as RFT.RestFactoryTypeBackendAuth['LogOut'];
}

class BackendEchoEndpoint implements RFT.RestFactoryTypeBackendEcho {
    Echo = { auth: false, timeout: 10000, method: 'GET', url: '/echo' } as RFT.RestFactoryTypeBackendEcho['Echo'];
}

class BackendTestEndpoint implements RFT.RestFactoryTypeBackendTest {
    Test = { auth: true, timeout: 10000, method: 'POST', url: '/test' } as RFT.RestFactoryTypeBackendTest['Test'];
}

export const RestFactoryEndpoint: RFT.RestFactoryTypes = {
    Backend: new BackendEndpoint()
}
