import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

@Component({
  selector: 'post-component',
  templateUrl: 'post-component.html',
  styleUrls: ['post-component.scss']
})
export class PostComponent {

  @Input('board') board: Board;
  @Input('post') post: Thread;

  @Output('post-click') onPostClickEmitter = new EventEmitter<Thread>();
  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<number>();

  constructor() { }

  public onPostClick(): void {
    this.onPostClickEmitter.emit(this.post);
  }

  public onReferenceClick(no: number): void {
    this.onReferenceClickEmitter.emit(no);
  }

}
