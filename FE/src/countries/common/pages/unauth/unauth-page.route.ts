import { PSERoute } from '@pse-fe/core/controllers/pse-nav-router.controller';

export const UnauthPageRoute: PSERoute<undefined, undefined, undefined> = {
    path: 'unauth',
    loadChildren: () => import('./unauth-page.module').then(m => m.UnauthPageModule)
};
