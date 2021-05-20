import { PSERoute } from '@pse-fe/core';

export const HomePageRoute: PSERoute = {
    path: 'home',
    loadChildren: () => import('./home-page.module').then(m => m.HomePageModule)
};
