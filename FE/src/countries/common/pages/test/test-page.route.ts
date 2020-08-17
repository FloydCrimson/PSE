import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const TestPageRoute: RouteImplementation<{ title: string; }, { page: number; }> = {
    path: 'home/test/:page',
    route: ['page'],
    loadChildren: () => import('./test-page.module').then(m => m.TestPageModule)
};
