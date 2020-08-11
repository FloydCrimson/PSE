import { Component, Input, OnInit } from '@angular/core';

import { FChanFactoryImplementation, Board, Thread } from 'global/common/implementations/factories/fchan.factory.implementation';
import { MediaService } from 'global/services/media.service';

@Component({
  selector: 'media-component',
  templateUrl: 'media-component.html',
  styleUrls: ['media-component.scss']
})
export class MediaComponent implements OnInit {

  @Input('board') board: Board;
  @Input('media') media: Thread;

  public type: 'img' | 'video' | 'flash';
  public status: 'undefined' | 'loading' | 'loaded' | 'error' | 'deleted' = 'undefined';
  public thumbnail: string;
  public src: string;

  constructor(
    private readonly mediaService: MediaService
  ) { }

  public async ngOnInit(): Promise<void> {
    if (this.media.tim) {
      this.type = (this.media.ext === '.swf') ? 'flash' : ((this.media.ext === '.webm') ? 'video' : 'img');
      this.status = 'loading';
      this.thumbnail = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext, true);
      const srcResponse = await this.mediaService.download(FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext));
      this.src = srcResponse.url;
      this.status = srcResponse.success ? 'loaded' : 'error';
    } else {
      this.status = 'undefined';
    }
  }

}
