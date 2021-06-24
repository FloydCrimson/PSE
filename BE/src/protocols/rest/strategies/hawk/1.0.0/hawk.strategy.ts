import { StrategyVersionType } from '../../../types/strategy.type';
import { HawkMethodImplementation } from '../common/hawk.implementation';
import { HawkScheme } from './hawk.scheme';

export const HawkVersionStrategy: StrategyVersionType<HawkMethodImplementation> = {
    scheme: HawkScheme
};
