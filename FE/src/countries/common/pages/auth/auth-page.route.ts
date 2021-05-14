import { PSERoute } from '@pse-fe/core/controllers/pse-nav-router.controller';

export const AuthPageRoute: PSERoute<undefined, undefined, undefined> = {
    path: 'auth',
    loadChildren: () => import('./auth-page.module').then(m => m.AuthPageModule)
};
