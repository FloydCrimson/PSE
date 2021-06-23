import { RouteType } from '../../../types/route.type';
import { NotFoundRouteImplementation } from './not-found.implementation';

export const NotFoundRoute: RouteType<NotFoundRouteImplementation> = {
    // /{any*}
    NotFoundANY: {
        method: '*',
        path: '/{any*}'
    }
};
