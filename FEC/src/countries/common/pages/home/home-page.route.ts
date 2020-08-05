import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const HomePageRoute: RouteImplementation<undefined> = {
    path: 'home',
    loadChildren: () => import('./home-page.module').then(m => m.HomePageModule)
};
