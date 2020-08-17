import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { CatalogThread, Board } from 'global/common/implementations/factories/fchan.factory.implementation';
import { RoutingService } from 'global/services/routing.service';
import { FChanService } from 'global/services/fchan.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'catalog-page',
  templateUrl: 'catalog-page.html',
  styleUrls: ['catalog-page.scss']
})
export class CatalogPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: HTMLIonContentElement & { el: HTMLElement };

  public params = this.routingService.getNavigationParams(RoutesIndex.CatalogPageRoute);

  public board: Board;
  public threads: CatalogThread[] = [];
  public length: number = 10;

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanService: FChanService
  ) { }

  public ngOnInit(): void {
    this.initialize(this.params.input.cache);
  }

  private initialize(cache: boolean): void {
    this.fchanService.getBoards(true).subscribe((result) => {
      if (result.success) {
        this.board = result.response.boards.find((board) => board.board === this.params.route.board);
        this.fchanService.getCatalog(this.params.route.board, cache).subscribe((result) => {
          if (result.success) {
            this.threads = result.response.reduce((ts, t) => ts.concat(t.threads), []);
          } else {
            console.error('fchanFactory.getCatalog', result);
          }
        });
      } else {
        console.error('fchanFactory.getBoards', result);
      }
    });
  }

  public onThreadClick(thread: CatalogThread): void {
    this.routingService.navigate('Root', RoutesIndex.ThreadPageRoute, { input: { cache: false }, route: { board: this.params.route.board, no: thread.no } }, { animationDirection: 'forward' });
  }

  public onReferenceClick(no: number): void {
    console.log('onReferenceClick', no);
  }

  public onBackButtonClick(event: Event): void {
    this.routingService.navigate('Root', RoutesIndex.BoardPageRoute, { input: { cache: true } }, { animationDirection: 'back' });
  }

  public onRefreshButtonClick(): void {
    this.initialize(false);
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

}
