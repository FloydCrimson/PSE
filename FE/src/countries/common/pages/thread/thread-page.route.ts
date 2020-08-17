import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const ThreadPageRoute: RouteImplementation<{ cache: boolean; }, { board: string; no: number; }> = {
    path: ':board/thread/:no',
    route: ['board', 'no'],
    loadChildren: () => import('./thread-page.module').then(m => m.ThreadPageModule)
};
