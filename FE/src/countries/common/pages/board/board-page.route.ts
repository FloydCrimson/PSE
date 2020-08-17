import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const BoardPageRoute: RouteImplementation<{ cache: boolean; }> = {
    path: 'board',
    loadChildren: () => import('./board-page.module').then(m => m.BoardPageModule)
};
