import { RouteImplementation } from 'global/common/implementations/route.implementation';

import { Board } from 'global/common/implementations/factories/fchan.factory.implementation';

export const CatalogPageRoute: RouteImplementation<{ board: Board; }, undefined, { board: string; }> = {
    path: 'catalog/:board',
    route: ['board'],
    loadChildren: () => import('./catalog-page.module').then(m => m.CatalogPageModule)
};
