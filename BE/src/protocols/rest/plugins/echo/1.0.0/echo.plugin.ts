import { PluginVersionType } from '../../../types/plugin.type';
import { EchoRouteImplementation } from './echo.implementation';
import { EchoRoute } from './echo.route';
import { EchoController } from './echo.controller';
import { EchoExtension } from './echo.extension';
import { EchoValidate } from './echo.validate';

export const EchoVersionPlugin: PluginVersionType<EchoRouteImplementation> = {
    route: EchoRoute,
    controller: EchoController,
    extension: EchoExtension,
    validate: EchoValidate
};
