import { PluginIndex } from '../../types/plugin.type';
import { NotFoundRouteImplementation as NFRI_1_0_0 } from './1.0.0/not-found.implementation';

export const NotFoundPlugin: PluginIndex<NFRI_1_0_0> = {
    config: () => import('./config.json'),
    version: {
        '1.0.0': async () => (await import('./1.0.0/not-found.plugin')).NotFoundPlugin
    },
    common: {}
};
