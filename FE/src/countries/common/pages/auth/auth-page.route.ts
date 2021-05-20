import { PSERoute } from '@pse-fe/core';

export const AuthPageRoute: PSERoute = {
    path: 'auth',
    loadChildren: () => import('./auth-page.module').then(m => m.AuthPageModule)
};
