import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const AuthPageRoute: RouteImplementation<undefined> = {
    path: 'auth',
    loadChildren: () => import('./auth-page.module').then(m => m.AuthPageModule)
};
