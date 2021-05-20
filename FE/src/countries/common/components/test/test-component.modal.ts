import { PSEModal } from '@pse-fe/core';

export const TestComponentModal: PSEModal<{ message: string; }, { message: string; }> = {
    id: 'TestComponentModal',
    component: () => import('./test-component').then(c => c.TestComponent)
};
