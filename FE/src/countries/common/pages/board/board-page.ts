import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { Board } from 'global/common/implementations/factories/fchan.factory.implementation';
import { RoutingService } from 'global/services/routing.service';
import { FChanService } from 'global/services/fchan.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'board-page',
  templateUrl: 'board-page.html',
  styleUrls: ['board-page.scss']
})
export class BoardPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: HTMLIonContentElement & { el: HTMLElement };

  public params = this.routingService.getNavigationParams(RoutesIndex.BoardPageRoute);

  public groups: { char: string; boards: Board[]; }[] = [];

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanService: FChanService
  ) { }

  public ngOnInit(): void {
    this.initialize(this.params.input.cache);
  }

  private initialize(cache: boolean): void {
    this.fchanService.call('getBoards', [], cache).subscribe((result) => {
      if (result.success) {
        this.groups = result.response.boards.reduce((gs, b) => {
          // FILTER FLASH BOARD
          if (b.board === 'f') {
            return gs;
          }
          //
          const group = gs.find((g) => g.char === b.board[0]);
          if (group) {
            group.boards.push(b);
          } else {
            gs.push({ char: b.board[0], boards: [b] });
          }
          return gs;
        }, []);
      } else {
        console.error('fchanFactory.getBoards', result);
      }
    });
  }

  public onCharClick(group: { char: string; boards: Board[]; }): void {
    const child = this.content.el.getElementsByClassName('board ' + group.char)[0] as HTMLDivElement;
    if (child) {
      const diff = child.offsetTop;
      this.content.scrollToPoint(undefined, diff, 500);
    }
  }

  public onBoardClick(board: Board): void {
    let params = RoutingService.getParams(RoutesIndex.CatalogPageRoute);
    params.input = { cache: false };
    params.route = { board: board.board };
    this.routingService.navigate('NavigateForward', RoutesIndex.CatalogPageRoute, params, { animationDirection: 'forward' });
  }

  public onRefreshButtonClick(): void {
    this.initialize(false);
  }

}
