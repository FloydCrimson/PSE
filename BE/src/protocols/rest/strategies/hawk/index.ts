import { StrategyIndex } from '../../types/strategy.type';
import { HawkMethodImplementation } from './common/hawk.implementation';

export const HawkStrategy: StrategyIndex<HawkMethodImplementation> = {
    config: () => import('./config.json'),
    version: {
        '1.0.0': async () => (await import('./1.0.0/hawk.strategy')).HawkVersionStrategy
    },
    common: {
        method: async () => (await import('./common/hawk.method')).HawkMethod
    }
};
