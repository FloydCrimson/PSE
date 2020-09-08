import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { Board, PostPost } from 'global/common/implementations/factories/fchan.factory.implementation';
import { RoutingService } from 'global/services/routing.service';
import { FChanService } from 'global/services/fchan.service';

import { CommentReference } from 'countries/common/components/comment/comment-component';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'archive-page',
  templateUrl: 'archive-page.html',
  styleUrls: ['archive-page.scss']
})
export class ArchivePage implements OnInit, AfterViewInit {

  @ViewChild(IonContent, { static: false }) content: HTMLIonContentElement & { el: HTMLElement };

  public params = this.routingService.getNavigationParams(RoutesIndex.ArchivePageRoute);

  public bs = new BehaviorSubject<boolean>(null);

  public board: Board;
  public posts: (PostPost & { downloaded: boolean; })[] = [];
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
          this.scrollToElement(this.posts[this.index].no);
        }
      } else {
        console.error('Failed to load ArchivePage.');
      }
    });
  }

  private initialize(cache: boolean, refresh: boolean): void {
    this.fchanService.call('getBoards', [], true).subscribe((result) => {
      if (result.success) {
        this.board = result.response.boards.find((board) => board.board === this.params.route.board);
        this.fchanService.call('getArchive', [{ board: this.params.route.board }], cache).subscribe((result) => {
          if (result.success) {
            this.posts = result.response.map((no) => {
              return { no, downloaded: false } as (PostPost & { downloaded: boolean; });
            });
            this.length = Math.min(this.posts.length, 10);
            if (!refresh && this.params.fragment) {
              const no = parseInt(this.params.fragment.replace(/^p/, ''));
              const index = this.posts.findIndex((post) => post.no === no);
              if (index > 0) {
                this.length = Math.min(this.posts.length, index + 10);
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

  public onPostClick(post: (PostPost & { downloaded: boolean; })): void {
    if (post.downloaded) {
      let params = RoutingService.getParams(RoutesIndex.ThreadPageRoute);
      params.input = { cache: true };
      params.route = { board: this.params.route.board, no: post.no };
      this.routingService.navigate('NavigateForward', RoutesIndex.ThreadPageRoute, params, { animationDirection: 'forward' });
    } else {
      this.fchanService.call('getPosts', [{ board: this.params.route.board, no: post.no }], true).subscribe((result) => {
        if (result.success) {
          const index = this.posts.findIndex((t) => t.no === post.no);
          this.posts[index] = { ...result.response.posts[0], downloaded: true };
        } else {
          // TODO: error management
        }
      });
    }
  }

  public async onPostVisibilityChange(post: (PostPost & { downloaded: boolean; }), event: { visible: boolean; }): Promise<void> {
    if (event.visible) {
      if (this.fchanService.cached('getPosts', [{ board: this.params.route.board, no: post.no }])) {
        this.onPostClick(post);
      };
    }
  }

  public async onReferenceClick<T extends keyof CommentReference>(reference: { type: T; value: CommentReference[T]; }): Promise<void> {
    if (reference.type === 'board-no-ref') {
      const value = reference.value as CommentReference['board-no-ref'];
      let params = RoutingService.getParams(RoutesIndex.ThreadPageRoute);
      params.input = { cache: false };
      params.route = { board: value.board, no: value.no };
      params.fragment = 'p' + value.ref;
      this.routingService.navigate('NavigateForward', RoutesIndex.ThreadPageRoute, params, { animationDirection: 'forward' });
    } else if (reference.type === 'board-no') {
      const value = reference.value as CommentReference['board-no'];
      let params = RoutingService.getParams(RoutesIndex.ThreadPageRoute);
      params.input = { cache: false };
      params.route = { board: value.board, no: value.no };
      this.routingService.navigate('NavigateForward', RoutesIndex.ThreadPageRoute, params, { animationDirection: 'forward' });
    } else if (reference.type === 'board') {
      const value = reference.value as CommentReference['board'];
      let params = RoutingService.getParams(RoutesIndex.CatalogPageRoute);
      params.input = { cache: false };
      params.route = { board: value.board };
      this.routingService.navigate('NavigateForward', RoutesIndex.CatalogPageRoute, params, { animationDirection: 'forward' });
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
    let params = RoutingService.getParams(RoutesIndex.BoardPageRoute);
    params.input = { cache: true };
    this.routingService.navigate('NavigateBack', RoutesIndex.BoardPageRoute, params, { animationDirection: 'back' });
  }

  public onRefreshButtonClick(): void {
    this.length = 0;
    this.index = 0;
    this.initialize(false, true);
  }

  public onTrackByPosts(index: number, post: (PostPost & { downloaded: boolean; })): number {
    return post.no;
  }

  public onIonInfinite(event): void {
    this.length = Math.min(this.posts.length, this.length + 10);
    if (this.length === this.posts.length) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

  private scrollToElement(no: number, duration?: number): void {
    const child = this.content.el.getElementsByClassName('post ' + no)[0] as HTMLDivElement;
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
