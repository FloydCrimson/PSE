import { PSERoute } from '@pse-fe/core';

export const UnauthPageRoute: PSERoute = {
    path: 'unauth',
    loadChildren: () => import('./unauth-page.module').then(m => m.UnauthPageModule)
};
