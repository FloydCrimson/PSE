import { StrategyVersionType } from '../../../types/strategy.type';
import { HawkMethodImplementation } from '../common/hawk.implementation';
import { HawkStrategyImplementation } from './hawk.implementation';
import { HawkScheme } from './hawk.scheme';

export const HawkVersionStrategy: StrategyVersionType<HawkMethodImplementation, HawkStrategyImplementation> = {
    scheme: HawkScheme,
    strategies: {
        Full: { type: 'full' },
        Partial: { type: 'partial' }
    }
};
