import { PSERoute } from '@pse-fe/core';

export const ChangeKeyPageRoute: PSERoute = {
    path: 'change-key',
    loadChildren: () => import('./change-key-page.module').then(m => m.ChangeKeyPageModule)
};
