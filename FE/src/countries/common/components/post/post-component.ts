import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

import { CommentReference } from '../comment/comment-component';

@Component({
  selector: 'post-component',
  templateUrl: 'post-component.html',
  styleUrls: ['post-component.scss']
})
export class PostComponent {

  @Input('board') board: Board;
  @Input('post') post: Thread;
  @Input('show-info') showInfo: boolean;

  @Output('post-click') onPostClickEmitter = new EventEmitter<Thread>();
  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<{ type: keyof CommentReference; value: CommentReference[keyof CommentReference]; }>();

  constructor() { }

  public onPostClick(): void {
    this.onPostClickEmitter.emit(this.post);
  }

  public onReferenceClick<T extends keyof CommentReference>(reference: { type: T; value: CommentReference[T]; }): void {
    this.onReferenceClickEmitter.emit(reference);
  }

}
