import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { CatalogThread, Board } from 'global/common/implementations/factories/fchan.factory.implementation';
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

}
