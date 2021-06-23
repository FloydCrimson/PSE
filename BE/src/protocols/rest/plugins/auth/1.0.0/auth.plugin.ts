import { PluginVersionType } from '../../../types/plugin.type';
import { AuthRouteImplementation } from './auth.implementation';
import { AuthRoute } from './auth.route';
import { AuthController } from './auth.controller';
import { AuthExtension } from './auth.extension';

export const AuthVersionPlugin: PluginVersionType<AuthRouteImplementation> = {
    route: AuthRoute,
    controller: AuthController,
    extension: AuthExtension
};
