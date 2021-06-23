import { PluginCommonType } from '../../../types/plugin.type';
import { EchoMethodImplementation } from './echo.implementation';
import { EchoMethod } from './echo.method';

export const EchoCommonPlugin: PluginCommonType<EchoMethodImplementation> = {
    method: EchoMethod
};
