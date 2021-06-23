import { StrategyIndex } from '../../types/strategy.type';
import { AuthMethodImplementation } from './common/auth.implementation';

export const AuthStrategy: StrategyIndex<AuthMethodImplementation> = {
    config: () => import('./config.json'),
    version: {
        '1.0.0': async () => (await import('./1.0.0/auth.strategy')).AuthVersionStrategy
    },
    common: {
        method: async () => (await import('./common/auth.method')).AuthMethod
    }
};
