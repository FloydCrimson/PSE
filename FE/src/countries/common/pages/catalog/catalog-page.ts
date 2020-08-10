import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { CatalogThread, Board, FChanFactoryImplementation } from 'global/common/implementations/factories/fchan.factory.implementation';
import { FChanFactory } from 'global/factories/fchan.factory';
import { RoutingService } from 'global/services/routing.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'catalog-page',
  templateUrl: 'catalog-page.html',
  styleUrls: ['catalog-page.scss'],
})
export class CatalogPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: HTMLIonContentElement & { el: HTMLElement };

  public board: Board;
  public threads: CatalogThread[] = [];
  public length: number = 10;

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanFactory: FChanFactory
  ) {
    const params = this.routingService.getNavigationParams(RoutesIndex.CatalogPageRoute);
    this.board = params.input.board;
  }

  public ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    this.fchanFactory.get('API').getCatalog(this.board.board).subscribe((result) => {
      if (result.success) {
        this.threads = result.response.reduce((ts, t) => ts.concat(t.threads), []);
      } else {
        console.error('fchanFactory.getCatalog', result);
      }
    }, (error) => {
      console.error('fchanFactory.getCatalog', error);
    });
  }

  public onThreadClick(thread: CatalogThread): void {
    console.log('onThreadClick', thread);
  }

  public onTrackByThreads(index: number, thread: CatalogThread): number {
    return thread.no;
  }

  public onIonInfinite(event): void {
    this.length = Math.min(this.threads.length, this.length + 10);
    event.target.complete();
  }

  public getUserImageUrlFromThread(thread: CatalogThread): string {
    return FChanFactoryImplementation.getUserImageUrl(this.board.board, thread.tim, thread.ext);
  }

}
