import { StrategyVersionType } from '../../../types/strategy.type';
import { AuthMethodImplementation } from '../common/auth.implementation';
import { AuthScheme } from './auth.scheme';

export const AuthVersionStrategy: StrategyVersionType<AuthMethodImplementation> = {
    scheme: AuthScheme
};
