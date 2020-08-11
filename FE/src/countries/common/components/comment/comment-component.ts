import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'comment-component',
  templateUrl: 'comment-component.html',
  styleUrls: ['comment-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentComponent implements AfterViewInit {

  @ViewChild('container', { static: false }) container: HTMLDivElement & { nativeElement: HTMLElement };

  @Input('comment') comment: string;

  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<number>();

  constructor() { }

  public ngAfterViewInit(): void {
    const quotelinks: HTMLElement[] = Array.from(this.container.nativeElement.getElementsByClassName('quotelink')) as HTMLElement[];
    quotelinks.forEach((quotelink) => {
      if (quotelink.hasAttribute('href')) {
        const no = parseInt(quotelink.getAttribute('href').replace(/^#p/, ''));
        quotelink.removeAttribute('href');
        quotelink.addEventListener('click', (event) => {
          event.stopPropagation();
          this.onReferenceClickEmitter.emit(no);
        });
      }
    });
    const ss: HTMLElement[] = Array.from(this.container.nativeElement.getElementsByTagName('s')) as HTMLElement[];
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

}
