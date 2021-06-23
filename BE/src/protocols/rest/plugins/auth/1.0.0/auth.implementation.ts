import { RouteImplementation } from '../../../implementations/route.implementation';

export interface AuthRouteImplementation {
    EmailAvailableOPTIONS: RouteImplementation;
    EmailAvailablePOST: RouteImplementation<{ email: string; }, undefined, { available: boolean; }>;
    NicknameAvailableOPTIONS: RouteImplementation;
    NicknameAvailablePOST: RouteImplementation<{ nickname: string; }, undefined, { available: boolean; }>;
    SignInOPTIONS: RouteImplementation;
    SignInPOST: RouteImplementation<{ email: string; nickname: string; }>;
    SignOutOPTIONS: RouteImplementation;
    SignOutPOST: RouteImplementation;
    LogInOPTIONS: RouteImplementation;
    LogInPOST: RouteImplementation<undefined, undefined, { authenticated: boolean; }>;
    LogOutOPTIONS: RouteImplementation;
    LogOutPOST: RouteImplementation;
    RecoverKeyOPTIONS: RouteImplementation;
    RecoverKeyPOST: RouteImplementation<{ type: 'id' | 'email' | 'nickname'; value: string; }>;
    ChangeKeyOPTIONS: RouteImplementation;
    ChangeKeyPOST: RouteImplementation<{ key: string; }>;
}
