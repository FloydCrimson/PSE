import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { CatalogThread, Board } from 'global/common/implementations/factories/fchan.factory.implementation';
import { RoutingService } from 'global/services/routing.service';
import { FChanService } from 'global/services/fchan.service';

import { CommentReference } from 'countries/common/components/comment/comment-component';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'catalog-page',
  templateUrl: 'catalog-page.html',
  styleUrls: ['catalog-page.scss']
})
export class CatalogPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { static: false }) content: HTMLIonContentElement & { el: HTMLElement };

  public params = this.routingService.getNavigationParams(RoutesIndex.CatalogPageRoute);

  public bs = new BehaviorSubject<boolean>(null);

  public board: Board;
  public threads: CatalogThread[] = [];
  public length: number = 0;
  public index: number = 0;

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanService: FChanService
  ) { }

  public ngOnInit(): void {
    this.initialize(this.params.input.cache, false);
  }

  public ngAfterViewInit(): void {
    this.bs.asObservable().pipe(skipWhile((success) => success === null), take(1)).subscribe((success) => {
      if (success) {
        if (this.index > 0) {
          this.scrollToElement(this.threads[this.index].no);
        }
      } else {
        console.error('Failed to load CatalogPage.');
      }
    });
  }

  private initialize(cache: boolean, refresh: boolean): void {
    this.fchanService.getBoards(true).subscribe((result) => {
      if (result.success) {
        this.board = result.response.boards.find((board) => board.board === this.params.route.board);
        this.fchanService.getCatalog(this.params.route.board, cache).subscribe((result) => {
          if (result.success) {
            this.threads = result.response.reduce((ts, t) => ts.concat(t.threads), []);
            this.length = Math.min(this.threads.length, 10);
            if (!refresh && this.params.fragment) {
              const no = parseInt(this.params.fragment.replace(/^p/, ''));
              const index = this.threads.findIndex((thread) => thread.no === no);
              if (index > 0) {
                this.length = Math.min(this.threads.length, index + 10);
                this.index = index;
              }
            }
            this.bs.next(true);
          } else {
            this.bs.next(false);
          }
        });
      } else {
        this.bs.next(false);
      }
    });
  }

  public onThreadClick(thread: CatalogThread): void {
    this.routingService.navigate('NavigateForward', RoutesIndex.ThreadPageRoute, { input: { cache: false }, route: { board: this.params.route.board, no: thread.no } }, { animationDirection: 'forward' });
  }

  public async onReferenceClick<T extends keyof CommentReference>(reference: { type: T; value: CommentReference[T]; }): Promise<void> {
    if (reference.type === 'board-no-ref') {
      const value = reference.value as CommentReference['board-no-ref'];
      this.routingService.navigate('NavigateForward', RoutesIndex.ThreadPageRoute, { input: { cache: false }, route: { board: value.board, no: value.no }, fragment: 'p' + value.ref }, { animationDirection: 'forward' });
    } else if (reference.type === 'board-no') {
      const value = reference.value as CommentReference['board-no'];
      this.routingService.navigate('NavigateForward', RoutesIndex.ThreadPageRoute, { input: { cache: false }, route: { board: value.board, no: value.no } }, { animationDirection: 'forward' });
    } else if (reference.type === 'board') {
      const value = reference.value as CommentReference['board'];
      this.routingService.navigate('NavigateForward', RoutesIndex.CatalogPageRoute, { input: { cache: false }, route: { board: value.board } }, { animationDirection: 'forward' });
    } else {
      try {
        const value = reference.value as CommentReference['unrecognized'];
        const url = new URL(value.href);
        window.open(url.href, '_system')
      } catch (error) {
        console.log('Unrecognized link found.', reference);
      }
    }
  }

  public onBackButtonClick(event: Event): void {
    this.routingService.navigate('Pop');
  }

  public onRefreshButtonClick(): void {
    this.length = 0;
    this.index = 0;
    this.initialize(false, true);
  }

  public onTrackByThreads(index: number, thread: CatalogThread): number {
    return thread.no;
  }

  public onIonInfinite(event): void {
    this.length = Math.min(this.threads.length, this.length + 10);
    if (this.length === this.threads.length) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

  private scrollToElement(no: number, duration?: number): void {
    const child = this.content.el.getElementsByClassName('thread ' + no)[0] as HTMLDivElement;
    if (child) {
      const id = setInterval(() => {
        if (child.clientHeight > 0) {
          const diff = child.offsetTop;
          this.content.scrollToPoint(undefined, diff, duration);
          clearInterval(id);
        }
      }, 50);
    }
  }

}
