import { PSERoute } from '@pse-fe/core';

export const TestPageRoute: PSERoute<{ message: string; }> = {
    path: 'test',
    loadChildren: () => import('./test-page.module').then(m => m.TestPageModule)
};
