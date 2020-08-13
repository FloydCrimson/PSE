import { EventEmitter } from '@angular/core';

import { ModalImplementation } from 'global/common/implementations/modal.implementation';
import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

import { CommentReference } from '../comment/comment-component';

export const PostComponentModal: ModalImplementation<{ board: Board; post: Thread; overlay: boolean; onPostClickEmitter: EventEmitter<Thread>; onReferenceClickEmitter: EventEmitter<{ type: keyof CommentReference; value: CommentReference[keyof CommentReference]; }>; }> = {
    loadChildren: () => import('./post-component').then(m => m.PostComponent)
};
