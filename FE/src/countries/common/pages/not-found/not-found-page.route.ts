import { PSERoute } from '@pse-fe/core/controllers/pse-nav-router.controller';

export const NotFoundPageRoute: PSERoute<undefined, undefined, undefined> = {
    path: 'not-found',
    loadChildren: () => import('./not-found-page.module').then(m => m.NotFoundPageModule)
};
