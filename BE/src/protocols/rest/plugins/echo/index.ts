import { PluginIndex } from '../../types/plugin.type';
import { EchoRouteImplementation as ERI_1_0_0 } from './1.0.0/echo.implementation';
import { EchoMethodImplementation } from './common/echo.implementation';

export const EchoPlugin: PluginIndex<ERI_1_0_0, EchoMethodImplementation> = {
    config: () => import('./config.json'),
    version: {
        '1.0.0': async () => (await import('./1.0.0/echo.plugin')).EchoVersionPlugin
    },
    common: {
        method: async () => (await import('./common/echo.method')).EchoMethod
    }
};
