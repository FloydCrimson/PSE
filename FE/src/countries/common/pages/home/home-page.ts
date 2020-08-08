import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { Board } from 'global/common/implementations/factories/fchan.factory.implementation';
import { FChanFactory } from 'global/factories/fchan.factory';
import { RoutingService } from 'global/services/routing.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: { el: HTMLElement };

  public groups: { char: string; boards: Board[]; }[] = [];

  constructor(
    private readonly routingService: RoutingService,
    private readonly fchanFactory: FChanFactory
  ) { }

  public ngOnInit(): void {
    this.initialize();
  }

  private initialize(): void {
    this.fchanFactory.get('API').getBoards().subscribe((result) => {
      if (result.success) {
        this.groups = result.response.boards.reduce((gs, b) => {
          const group = gs.find((g) => g.char === b.board[0]);
          if (group) {
            group.boards.push(b);
          } else {
            gs.push({ char: b.board[0], boards: [b] });
          }
          return gs;
        }, []);
      }
    }, (error) => {
      console.error('fchanFactory.getBoards', error);
    });
  }

  public onCharClick(group: { char: string; boards: Board[]; }): void {
    const div = this.content.el.getElementsByClassName('board ' + group.char)[0] as HTMLDivElement;
    div.scrollIntoView({ behavior: 'smooth' });
  }

  public onBoardClick(board: Board): void {
    console.log('onBoardClick', board);
  }

}
