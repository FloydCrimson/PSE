import { StrategyVersionType } from '../../../types/strategy.type';
import { HawkMethodImplementation } from '../common/hawk.implementation';
import { HawkStrategyImplementation } from './hawk.implementation';
import { HawkScheme } from './hawk.scheme';

export const HawkVersionStrategy: StrategyVersionType<HawkMethodImplementation, HawkStrategyImplementation> = {
    scheme: HawkScheme,
    strategies: {
        Full: { auth: { strategy: 'HawkStrategy.Full', mode: 'required', payload: 'required' }, options: { type: 'full' } },
        Partial: { auth: { strategy: 'HawkStrategy.Partial', mode: 'required', payload: 'required' }, options: { type: 'partial' } }
    }
};
