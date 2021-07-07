import { ValidatePluginType } from '../../../types/validate.type';
import { AuthRouteImplementation } from './auth.implementation';
import { AuthMethodImplementation } from '../common/auth.implementation';

import * as VI from '../../../validates.index';

const EmailAvailablePOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['EmailAvailablePOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: { email: 'string' } }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: { available: 'boolean' } })
};

const NicknameAvailablePOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['NicknameAvailablePOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: { nickname: 'string' } }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: { available: 'boolean' } })
};

const SignInPOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['SignInPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: { email: 'string', nickname: 'string' } }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const SignOutPOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['SignOutPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const LogInPOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['LogInPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: { authenticated: 'boolean' } })
};

const LogOutPOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['LogOutPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const RecoverKeyPOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['RecoverKeyPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const ChangeKeyPOSTValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation>['ChangeKeyPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: { key: 'string' }, crypted: true }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {}, crypted: true }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {}, crypted: true })
};

export const AuthValidate: ValidatePluginType<AuthRouteImplementation, AuthMethodImplementation> = {
    // /auth/email-available
    EmailAvailablePOST: EmailAvailablePOSTValidate,
    // /auth/nickname-available
    NicknameAvailablePOST: NicknameAvailablePOSTValidate,
    // /auth/sign-in
    SignInPOST: SignInPOSTValidate,
    // /auth/sign-out
    SignOutPOST: SignOutPOSTValidate,
    // /auth/log-in
    LogInPOST: LogInPOSTValidate,
    // /auth/log-out
    LogOutPOST: LogOutPOSTValidate,
    // /auth/recover-key
    RecoverKeyPOST: RecoverKeyPOSTValidate,
    // /auth/change-key
    ChangeKeyPOST: ChangeKeyPOSTValidate
};
