import { Component, Input } from '@angular/core';

import { Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

@Component({
  selector: 'title-component',
  templateUrl: 'title-component.html',
  styleUrls: ['title-component.scss']
})
export class TitleComponent {

  @Input('board') board: Board;
  @Input('post') post: Thread;

  constructor() { }

}
