import { ExtensionPluginType } from '../../../types/extension.type';
import { AuthRouteImplementation } from './auth.implementation';
import { AuthMethodImplementation } from '../common/auth.implementation';

import * as EI from '../../../extensions.index';

const EmailAvailableOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['EmailAvailableOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type'] })]
};

const NicknameAvailableOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['NicknameAvailableOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type'] })]
};

const SignInOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['SignInOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type'] })]
};

const SignOutOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['SignOutOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type'] })]
};

const LogInOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['LogInOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type', 'authorization'] })]
};

const LogOutOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['LogOutOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type', 'authorization'] })]
};

const RecoverKeyOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['RecoverKeyOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type'] })]
};

const ChangeKeyOPTIONSExtension: ExtensionPluginType<AuthRouteImplementation, AuthMethodImplementation>['ChangeKeyOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'POST'], ACAHeaders: ['content-type', 'authorization'] })]
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
