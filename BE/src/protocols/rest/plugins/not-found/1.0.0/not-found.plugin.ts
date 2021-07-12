import { PluginVersionType } from '../../../types/plugin.type';
import { NotFoundRouteImplementation } from './not-found.implementation';
import { NotFoundRoute } from './not-found.route';
import { NotFoundController } from './not-found.controller';

export const NotFoundPlugin: PluginVersionType<NotFoundRouteImplementation> = {
    route: NotFoundRoute,
    controller: NotFoundController
};
