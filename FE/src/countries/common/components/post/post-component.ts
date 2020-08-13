import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';
import { ModalService } from 'global/services/modal.service';

import * as ModalsIndex from '@countries/modals.index';

@Component({
  selector: 'post-component',
  templateUrl: 'post-component.html',
  styleUrls: ['post-component.scss']
})
export class PostComponent {

  @Input('board') board: Board;
  @Input('post') post: Thread;
  @Input('overlay') overlay: boolean = false;

  @Output('post-click') onPostClickEmitter = new EventEmitter<Thread>();
  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<number>();

  constructor(
    private readonly modalService: ModalService
  ) { }

  public onPostClick(): void {
    this.onPostClickEmitter.emit(this.post);
  }

  public onReferenceClick(no: number): void {
    this.onReferenceClickEmitter.emit(no);
  }

  public onCloseClick(): void {
    this.modalService.dismiss(ModalsIndex.PostComponentModal);
  }

}
