import { RouteType } from '../../../types/route.type';
import { AuthRouteImplementation } from './auth.implementation';

export const AuthRoute: RouteType<AuthRouteImplementation> = {
    // /auth/email-available
    EmailAvailableOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/email-available',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    EmailAvailablePOST: {
        method: 'POST',
        path: '/auth/email-available',
        options: { cors: { origin: ['*'], credentials: false } },
        masks: {
            maskB: { email: 'string' },
            maskO: { available: 'boolean' }
        }
    },
    // /auth/nickname-available
    NicknameAvailableOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/nickname-available',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    NicknameAvailablePOST: {
        method: 'POST',
        path: '/auth/nickname-available',
        options: { cors: { origin: ['*'], credentials: false } },
        masks: {
            maskB: { nickname: 'string' },
            maskO: { available: 'boolean' }
        }
    },
    // /auth/sign-in
    SignInOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/sign-in',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    SignInPOST: {
        method: 'POST',
        path: '/auth/sign-in',
        options: { cors: { origin: ['*'], credentials: false } },
        masks: {
            maskB: { email: 'string', nickname: 'string' }
        }
    },
    // /auth/sign-out
    SignOutOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/sign-out',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    SignOutPOST: {
        method: 'POST',
        path: '/auth/sign-out',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } }
    },
    // /auth/log-in
    LogInOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/log-in',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    LogInPOST: {
        method: 'POST',
        path: '/auth/log-in',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } },
        masks: {
            maskO: { authenticated: 'boolean' }
        }
    },
    // /auth/log-out
    LogOutOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/log-out',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    LogOutPOST: {
        method: 'POST',
        path: '/auth/log-out',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } }
    },
    // /auth/recover-key
    RecoverKeyOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/recover-key',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    RecoverKeyPOST: {
        method: 'POST',
        path: '/auth/recover-key',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Partial', mode: 'required', payload: 'required' } },
        masks: {
            maskB: { type: 'string', value: 'string' }
        }
    },
    // /auth/change-key
    ChangeKeyOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/change-key',
        options: { cors: { origin: ['*'], credentials: false } }
    },
    ChangeKeyPOST: {
        method: 'POST',
        path: '/auth/change-key',
        options: { cors: { origin: ['*'], credentials: true }, auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' } },
        masks: {
            maskB: { key: 'string' }
        }
    }
};
