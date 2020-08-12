import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { Board, CatalogThread, PostPost } from 'global/common/implementations/factories/fchan.factory.implementation';
import { RoutingService } from 'global/services/routing.service';
import { FChanService } from 'global/services/fchan.service';

import { CommentReference } from 'countries/common/components/comment/comment-component';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'thread-page',
  templateUrl: 'thread-page.html',
  styleUrls: ['thread-page.scss']
})
export class ThreadPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: HTMLIonContentElement & { el: HTMLElement };

  public board: Board;
  public thread: CatalogThread;
  public posts: PostPost[] = [];
  public length: number = 10;

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanService: FChanService
  ) {
    const params = this.routingService.getNavigationParams(RoutesIndex.ThreadPageRoute);
    this.board = params.input.board;
    this.thread = params.input.thread;
  }

  public ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    this.fchanService.getPosts(this.board.board, this.thread.no).subscribe((result) => {
      if (result.success) {
        this.posts = result.response.posts;
      } else {
        console.error('fchanFactory.getPosts', result);
      }
    }, (error) => {
      console.error('fchanFactory.getPosts', error);
    });
  }

  public onPostClick(post: PostPost): void {
    console.log('onPostClick', post);
  }

  public onReferenceClick<T extends keyof CommentReference>(reference: { type: T; value: CommentReference[T]; }): void {
    if (reference.type === 'board-no-ref') {
      console.log(reference);
    } else if (reference.type === 'board-no') {
      console.log(reference);
    } else if (reference.type === 'ref') {
      const value = reference.value as CommentReference['ref'];
      const child = this.content.el.getElementsByClassName('post ' + value.ref)[0] as HTMLDivElement;
      if (child) {
        const diff = child.offsetTop;
        this.content.scrollToPoint(undefined, diff, 500);
      }
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

  public onTrackByPosts(index: number, post: PostPost): number {
    return post.no;
  }

  public onIonInfinite(event): void {
    this.length = Math.min(this.posts.length, this.length + 5);
    if (this.length === this.posts.length) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

}
