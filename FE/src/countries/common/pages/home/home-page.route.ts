import { PSERoute } from '@pse-fe/core/controllers/pse-nav-router.controller';

export const HomePageRoute: PSERoute<undefined, undefined, undefined> = {
    path: 'home',
    loadChildren: () => import('./home-page.module').then(m => m.HomePageModule)
};
