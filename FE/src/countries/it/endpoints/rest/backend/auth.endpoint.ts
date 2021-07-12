import * as RestFT from 'global/factories/rest.factory.type';

export const BackendAuthEndpoint: RestFT.RestFactoryTypeBackendAuth = {
    // /auth/email-available
    EmailAvailablePOST: {
        method: 'POST',
        path: '/auth/email-available'
    },
    // /auth/nickname-available
    NicknameAvailablePOST: {
        method: 'POST',
        path: '/auth/nickname-available'
    },
    // /auth/sign-in
    SignInPOST: {
        method: 'POST',
        path: '/auth/sign-in'
    },
    // /auth/sign-out
    SignOutPOST: {
        method: 'POST',
        path: '/auth/sign-out',
        options: { auth: 'full' }
    },
    // /auth/log-in
    LogInPOST: {
        method: 'POST',
        path: '/auth/log-in',
        options: { auth: 'full' }
    },
    // /auth/log-out
    LogOutPOST: {
        method: 'POST',
        path: '/auth/log-out',
        options: { auth: 'full' }
    },
    // /auth/recover-key
    RecoverKeyPOST: {
        method: 'POST',
        path: '/auth/recover-key',
        options: { auth: 'partial' }
    },
    // /auth/change-key
    ChangeKeyPOST: {
        method: 'POST',
        path: '/auth/change-key',
        options: { auth: 'full', crypted: true }
    }
};
