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

  @Output('reference-click') onReferenceClickEmitter = new EventEmitter<{ type: keyof CommentReference; value: CommentReference[keyof CommentReference]; }>();

  constructor() { }

  public ngAfterViewInit(): void {
    const as: HTMLElement[] = Array.from(this.container.nativeElement.getElementsByTagName('a')) as HTMLElement[];
    as.forEach((a) => {
      if (a.hasAttribute('href')) {
        const href = a.getAttribute('href');
        a.removeAttribute('href');
        a.addEventListener('click', (event) => {
          event.stopPropagation();
          this.onReferenceClickEmitter.emit(this.getReference(href));
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

  private getReference(href: string): { type: keyof CommentReference; value: CommentReference[keyof CommentReference]; } {
    if (/^(\/\w+\/thread\/\d+#p\d+)$/.test(href)) {
      const [, board, , no, ref] = href.replace('#p', '/').split('/');
      return { type: 'board-no-ref', value: { board, no: parseInt(no), ref: parseInt(ref) } as CommentReference['board-no-ref'] };
    } else if (/^(\/\w+\/thread\/\d+)$/.test(href)) {
      const [, board, , no] = href.split('/');
      return { type: 'board-no', value: { board, no: parseInt(no) } as CommentReference['board-no'] };
    } else if (/^(#p\d+)$/.test(href)) {
      const [, ref] = href.replace('#p', '/').split('/');
      return { type: 'ref', value: { ref: parseInt(ref) } as CommentReference['ref'] };
    } else {
      return { type: 'unrecognized', value: { href } as CommentReference['unrecognized'] };
    }
  }

}

export interface CommentReference {
  'board-no-ref': { board: string; no: number; ref: number; };
  'board-no': { board: string; no: number; };
  'ref': { ref: number; };
  'unrecognized': { href: string; };
}
