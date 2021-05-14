import { PSERoute } from '@pse-fe/core/controllers/pse-nav-router.controller';

export const ChangeKeyPageRoute: PSERoute<undefined, undefined, undefined> = {
    path: 'change-key',
    loadChildren: () => import('./change-key-page.module').then(m => m.ChangeKeyPageModule)
};
