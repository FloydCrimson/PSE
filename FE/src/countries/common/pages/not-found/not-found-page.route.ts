import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const NotFoundPageRoute: RouteImplementation = {
    path: 'not-found',
    loadChildren: () => import('./not-found-page.module').then(m => m.NotFoundPageModule)
};
