import { RouteImplementation } from 'global/common/implementations/route.implementation';

export const ChangeKeyPageRoute: RouteImplementation = {
    path: 'change-key',
    loadChildren: () => import('./change-key-page.module').then(m => m.ChangeKeyPageModule)
};
