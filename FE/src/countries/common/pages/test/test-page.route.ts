import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const TestPageRoute: RouteImplementation<any> = {
    path: 'home/test',
    loadChildren: () => import('./test-page.module').then(m => m.TestPageModule)
};
