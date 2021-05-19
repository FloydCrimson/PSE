import { PSERoute } from '@pse-fe/core';

export const TestPageRoute: PSERoute<{ message: string; }, undefined, undefined> = {
    path: 'test',
    loadChildren: () => import('./test-page.module').then(m => m.TestPageModule)
};
