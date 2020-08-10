import { Component, Input, OnInit } from '@angular/core';

import { FChanFactoryImplementation, Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';

@Component({
  selector: 'media-component',
  templateUrl: 'media-component.html',
  styleUrls: ['media-component.scss'],
})
export class MediaComponent implements OnInit {

  @Input('board') board: Board;
  @Input('media') media: Thread;

  public thumbnail: string;
  public src: string;
  public type: 'img' | 'video' | 'flash';
  public status: 'undefined' | 'loading' | 'loaded' | 'error' | 'deleted' = 'undefined';

  constructor() { }

  public ngOnInit(): void {
    if (this.media.tim) {
      this.thumbnail = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext, true);
      this.src = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext);
      this.type = (this.media.ext === '.swf') ? 'flash' : ((this.media.ext === '.webm') ? 'video' : 'img');
      this.status = 'loading';
    } else {
      this.status = 'undefined';
    }
  }

}
