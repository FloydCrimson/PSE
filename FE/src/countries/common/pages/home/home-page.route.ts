import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const HomePageRoute: RouteImplementation<{ title: string; }> = {
    path: 'home',
    loadChildren: () => import('./home-page.module').then(m => m.HomePageModule)
};
