import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const BoardPageRoute: RouteImplementation<any> = {
    path: 'board',
    loadChildren: () => import('./board-page.module').then(m => m.BoardPageModule)
};
