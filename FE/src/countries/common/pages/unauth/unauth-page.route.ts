import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const UnauthPageRoute: RouteImplementation<undefined, undefined> = {
    path: 'unauth',
    loadChildren: () => import('./unauth-page.module').then(m => m.UnauthPageModule)
};
