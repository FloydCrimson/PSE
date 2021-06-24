import { StrategyCommonType } from '../../../types/strategy.type';
import { HawkMethodImplementation } from './hawk.implementation';
import { HawkMethod } from './hawk.method';

export const HawkCommonStrategy: StrategyCommonType<HawkMethodImplementation> = {
    method: HawkMethod
};
