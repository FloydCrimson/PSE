import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const ArchivePageRoute: RouteImplementation<{ cache: boolean; }, { board: string; }> = {
    path: ':board/archive',
    loadChildren: () => import('./archive-page.module').then(m => m.ArchivePageModule),
    defaultInput: { cache: false }
};
