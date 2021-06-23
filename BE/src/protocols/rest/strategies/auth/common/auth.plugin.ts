import { StrategyCommonType } from '../../../types/strategy.type';
import { AuthMethodImplementation } from './auth.implementation';
import { AuthMethod } from './auth.method';

export const AuthCommonStrategy: StrategyCommonType<AuthMethodImplementation> = {
    method: AuthMethod
};
