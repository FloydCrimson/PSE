import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { IonCard } from '@ionic/angular';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

@Component({
  selector: 'post-component',
  templateUrl: 'post-component.html',
  styleUrls: ['post-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements AfterViewInit {

  @ViewChild(IonCard, { static: false }) card: HTMLIonCardElement & { el: HTMLElement };

  @Input('board') board: Board;
  @Input('post') post: Thread;

  @Output('post-click') onPostClickEmitter = new EventEmitter<Thread>();
  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<number>();

  constructor() { }

  public ngAfterViewInit(): void {
    const sub: HTMLElement = this.card.el.getElementsByClassName('sub')[0] as HTMLElement;
    const com: HTMLElement = this.card.el.getElementsByClassName('com')[0] as HTMLElement;
    [sub, com].forEach((element) => {
      if (element) {
        const quotelinks: HTMLElement[] = Array.from(element.getElementsByClassName('quotelink')) as HTMLElement[];
        quotelinks.forEach((quotelink) => {
          if (quotelink.hasAttribute('href')) {
            const no = parseInt(quotelink.getAttribute('href').replace(/^#p/, ''));
            quotelink.removeAttribute('href');
            quotelink.addEventListener('click', (event) => {
              event.stopPropagation();
              this.onReferenceClick(no);
            });
          }
        });
        const ss: HTMLElement[] = Array.from(element.getElementsByTagName('s')) as HTMLElement[];
        ss.forEach((s) => {
          s.classList.add('hidden');
          s.addEventListener('click', (event) => {
            event.stopPropagation();
            if (s.classList.contains('hidden')) {
              s.classList.remove('hidden');
            } else {
              s.classList.add('hidden');
            }
          });
        });
      }
    });
  }

  public onPostClick(): void {
    this.onPostClickEmitter.emit(this.post);
  }

  public onReferenceClick(no: number): void {
    this.onReferenceClickEmitter.emit(no);
  }

}
