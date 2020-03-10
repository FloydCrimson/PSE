import * as RFT from 'global/factories/repository.factory.type';

class BackendEndpoint implements RFT.RepositoryFactoryTypeBackend {
    Auth = new BackendAuthEndpoint();
    Echo = new BackendEchoEndpoint();
    Test = new BackendTestEndpoint();
}

class BackendAuthEndpoint implements RFT.RepositoryFactoryTypeBackendAuth {
    EmailAvailable = { auth: false, timeout: 10000, method: 'POST', url: '/auth/emailAvailable' } as RFT.RepositoryFactoryTypeBackendAuth['EmailAvailable'];
    NicknameAvailable = { auth: false, timeout: 10000, method: 'POST', url: '/auth/nicknameAvailable' } as RFT.RepositoryFactoryTypeBackendAuth['NicknameAvailable'];
    SignIn = { auth: false, timeout: 10000, method: 'POST', url: '/auth/signin' } as RFT.RepositoryFactoryTypeBackendAuth['SignIn'];
    SignOut = { auth: true, timeout: 10000, method: 'POST', url: '/auth/signout' } as RFT.RepositoryFactoryTypeBackendAuth['SignOut'];
    LogIn = { auth: true, timeout: 10000, method: 'POST', url: '/auth/login' } as RFT.RepositoryFactoryTypeBackendAuth['LogIn'];
    LogOut = { auth: true, timeout: 10000, method: 'POST', url: '/auth/logout' } as RFT.RepositoryFactoryTypeBackendAuth['LogOut'];
}

class BackendEchoEndpoint implements RFT.RepositoryFactoryTypeBackendEcho {
    Echo = { auth: false, timeout: 10000, method: 'GET', url: '/echo' } as RFT.RepositoryFactoryTypeBackendEcho['Echo'];
}

class BackendTestEndpoint implements RFT.RepositoryFactoryTypeBackendTest {
    Test = { auth: true, timeout: 10000, method: 'POST', url: '/test' } as RFT.RepositoryFactoryTypeBackendTest['Test'];
}

export const RepositoryFactoryEndpoint: RFT.RepositoryFactoryTypes = {
    Backend: new BackendEndpoint()
}
