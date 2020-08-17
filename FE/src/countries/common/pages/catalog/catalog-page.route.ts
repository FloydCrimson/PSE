import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const CatalogPageRoute: RouteImplementation<{ cache: boolean; }, { board: string; }> = {
    path: ':board/catalog',
    route: ['board'],
    loadChildren: () => import('./catalog-page.module').then(m => m.CatalogPageModule)
};
