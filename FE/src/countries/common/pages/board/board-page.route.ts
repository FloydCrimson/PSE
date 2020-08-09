import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const BoardPageRoute: RouteImplementation<undefined> = {
    path: 'board',
    loadChildren: () => import('./board-page.module').then(m => m.BoardPageModule)
};
