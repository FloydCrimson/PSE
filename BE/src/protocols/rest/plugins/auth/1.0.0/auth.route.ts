import { RouteType } from '../../../types/route.type';
import { AuthRouteImplementation } from './auth.implementation';
import { HawkVersionStrategy as HVS_1_0_0 } from '../../../strategies/hawk/1.0.0/hawk.strategy';

export const AuthRoute: RouteType<AuthRouteImplementation> = {
    // /auth/email-available
    EmailAvailableOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/email-available',
        options: { cors: { origin: ['*'] } }
    },
    EmailAvailablePOST: {
        method: 'POST',
        path: '/auth/email-available',
        options: { cors: { origin: ['*'] } }
    },
    // /auth/nickname-available
    NicknameAvailableOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/nickname-available',
        options: { cors: { origin: ['*'] } }
    },
    NicknameAvailablePOST: {
        method: 'POST',
        path: '/auth/nickname-available',
        options: { cors: { origin: ['*'] } }
    },
    // /auth/sign-in
    SignInOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/sign-in',
        options: { cors: { origin: ['*'] } }
    },
    SignInPOST: {
        method: 'POST',
        path: '/auth/sign-in',
        options: { cors: { origin: ['*'] } }
    },
    // /auth/sign-out
    SignOutOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/sign-out',
        options: { cors: { origin: ['*'] } }
    },
    SignOutPOST: {
        method: 'POST',
        path: '/auth/sign-out',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Full }
    },
    // /auth/log-in
    LogInOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/log-in',
        options: { cors: { origin: ['*'] } }
    },
    LogInPOST: {
        method: 'POST',
        path: '/auth/log-in',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Full }
    },
    // /auth/log-out
    LogOutOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/log-out',
        options: { cors: { origin: ['*'] } }
    },
    LogOutPOST: {
        method: 'POST',
        path: '/auth/log-out',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Full }
    },
    // /auth/recover-key
    RecoverKeyOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/recover-key',
        options: { cors: { origin: ['*'] } }
    },
    RecoverKeyPOST: {
        method: 'POST',
        path: '/auth/recover-key',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Partial }
    },
    // /auth/change-key
    ChangeKeyOPTIONS: {
        method: 'OPTIONS',
        path: '/auth/change-key',
        options: { cors: { origin: ['*'] } }
    },
    ChangeKeyPOST: {
        method: 'POST',
        path: '/auth/change-key',
        options: { cors: { origin: ['*'], credentials: true }, auth: HVS_1_0_0.strategies.Full }
    }
};
