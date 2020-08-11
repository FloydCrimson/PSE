import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { IonCard } from '@ionic/angular';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

@Component({
  selector: 'comment-component',
  templateUrl: 'comment-component.html',
  styleUrls: ['comment-component.scss'],
})
export class CommentComponent implements OnInit {

  @ViewChild(IonCard, { static: false }) card: HTMLIonCardElement & { el: HTMLElement };

  @Input('board') board: Board;
  @Input('thread') thread: Thread;

  @Output('thread-click') onThreadClickEmitter = new EventEmitter<Thread>();
  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<number>();

  constructor() { }

  public ngOnInit(): void {
    console.log(this.card);
  }

  public onThreadClick(): void {
    this.onThreadClickEmitter.emit(this.thread);
  }

  public onReferenceClick(no: number): void {
    this.onReferenceClickEmitter.emit(no);
  }

  public getThreadId(): string {
    return this.thread.no.toString();
  }

}
