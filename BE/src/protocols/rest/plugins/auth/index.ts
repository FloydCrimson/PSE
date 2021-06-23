import { PluginIndex } from '../../types/plugin.type';
import { AuthRouteImplementation as ARI_1_0_0 } from './1.0.0/auth.implementation';
import { AuthMethodImplementation } from './common/auth.implementation';

export const AuthPlugin: PluginIndex<ARI_1_0_0, AuthMethodImplementation> = {
    config: () => import('./config.json'),
    version: {
        '1.0.0': async () => (await import('./1.0.0/auth.plugin')).AuthVersionPlugin
    },
    common: {
        method: async () => (await import('./common/auth.method')).AuthMethod
    }
};
