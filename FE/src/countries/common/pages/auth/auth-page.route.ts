import { PSERoute } from '@pse-fe/core';

export const AuthPageRoute: PSERoute<undefined, undefined, undefined> = {
    path: 'auth',
    loadChildren: () => import('./auth-page.module').then(m => m.AuthPageModule)
};
