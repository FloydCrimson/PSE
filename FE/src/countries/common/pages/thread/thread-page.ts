import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { Board, FChanFactoryImplementation, CatalogThread, PostPost } from 'global/common/implementations/factories/fchan.factory.implementation';
import { RoutingService } from 'global/services/routing.service';
import { FChanService } from 'global/services/fchan.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'thread-page',
  templateUrl: 'thread-page.html',
  styleUrls: ['thread-page.scss'],
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

  public onTrackByPosts(index: number, post: PostPost): number {
    return post.no;
  }

  public onIonInfinite(event): void {
    this.length = Math.min(this.posts.length, this.length + 10);
    if (this.length === this.posts.length) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

  public getUserImageUrlFromThread(post: PostPost): string {
    return FChanFactoryImplementation.getUserImageUrl(this.board.board, post.tim, post.ext);
  }

}
