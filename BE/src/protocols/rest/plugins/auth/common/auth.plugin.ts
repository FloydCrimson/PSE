import { PluginCommonType } from '../../../types/plugin.type';
import { AuthMethodImplementation } from './auth.implementation';
import { AuthMethod } from './auth.method';

export const AuthCommonPlugin: PluginCommonType<AuthMethodImplementation> = {
    method: AuthMethod
};
