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

  public board: Board;
  public threads: CatalogThread[] = [];
  public length: number = 10;

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanService: FChanService
  ) {
    const params = this.routingService.getNavigationParams(RoutesIndex.CatalogPageRoute);
    this.board = params.input.board;
  }

  public ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    this.fchanService.getCatalog(this.board.board).subscribe((result) => {
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
    this.routingService.navigate('Forward', RoutesIndex.ThreadPageRoute, { input: { board: this.board, thread }, route: { board: this.board.board, no: thread.no } }, { animationDirection: 'forward' });
  }

  public onReferenceClick(no: number): void {
    console.log('onReferenceClick', no);
  }

  public onTrackByThreads(index: number, thread: CatalogThread): number {
    return thread.no;
  }

  public onIonInfinite(event): void {
    this.length = Math.min(this.threads.length, this.length + 5);
    if (this.length === this.threads.length) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

}
