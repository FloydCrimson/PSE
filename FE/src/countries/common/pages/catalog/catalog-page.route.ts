import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const CatalogPageRoute: RouteImplementation<{ cache: boolean; }, { board: string; }> = {
    path: ':board/catalog',
    loadChildren: () => import('./catalog-page.module').then(m => m.CatalogPageModule),
    defaultInput: { cache: false }
};
