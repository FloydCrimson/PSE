import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const AuthPageRoute: RouteImplementation = {
    path: 'auth',
    loadChildren: () => import('./auth-page.module').then(m => m.AuthPageModule)
};
