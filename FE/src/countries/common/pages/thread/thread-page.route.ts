import { RouteImplementation } from 'global/common/implementations/route.implementation';

import { Board, CatalogThread } from 'global/common/implementations/factories/fchan.factory.implementation';

export const ThreadPageRoute: RouteImplementation<{ cache: boolean; board: Board; thread: CatalogThread; }, { board: string; no: number; }> = {
    path: ':board/thread/:no',
    route: ['board', 'no'],
    loadChildren: () => import('./thread-page.module').then(m => m.ThreadPageModule)
};
