import { ExtensionPluginType } from '../../../types/extension.type';
import { AuthRouteImplementation } from './auth.implementation';
import { AuthMethodImplementation } from '../common/auth.implementation';

import * as EI from '../../../extensions.index';

const EmailAvailableOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['EmailAvailableOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type'] })]
};

const NicknameAvailableOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['NicknameAvailableOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type'] })]
};

const SignInOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['SignInOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type'] })]
};

const SignOutOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['SignOutOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const LogInOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['LogInOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const LogOutOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['LogOutOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const RecoverKeyOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['RecoverKeyOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const ChangeKeyOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['ChangeKeyOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

export const AuthExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation> = {
    // /auth/email-available
    EmailAvailableOPTIONS: EmailAvailableOPTIONSExtension,
    // /auth/nickname-available
    NicknameAvailableOPTIONS: NicknameAvailableOPTIONSExtension,
    // /auth/sign-in
    SignInOPTIONS: SignInOPTIONSExtension,
    // /auth/sign-out
    SignOutOPTIONS: SignOutOPTIONSExtension,
    // /auth/log-in
    LogInOPTIONS: LogInOPTIONSExtension,
    // /auth/log-out
    LogOutOPTIONS: LogOutOPTIONSExtension,
    // /auth/recover-key
    RecoverKeyOPTIONS: RecoverKeyOPTIONSExtension,
    // /auth/change-key
    ChangeKeyOPTIONS: ChangeKeyOPTIONSExtension
};
