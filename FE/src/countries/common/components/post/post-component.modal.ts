import { ModalImplementation } from 'global/common/implementations/modal.implementation';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

export const PostComponentModal: ModalImplementation<{ board: Board; post: Thread; overlay: boolean; }> = {
    loadChildren: () => import('./post-component').then(m => m.PostComponent)
};
