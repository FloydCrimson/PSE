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
  public status: 'undefined' | 'pause' | 'loading' | 'loaded' | 'error' | 'deleted' = 'undefined';
  public srct: string;
  public src: string;
  public visible: boolean = false;

  constructor(
    private readonly mediaService: MediaService
  ) { }

  public async ngOnInit(): Promise<void> {
    if (this.media.tim) {
      this.type = (this.media.ext === '.swf') ? 'flash' : ((this.media.ext === '.webm') ? 'video' : 'img');
      this.status = 'pause';
    }
  }

  public async onViewportVisibilityChange(event: { visible: boolean; }): Promise<void> {
    if (this.status === 'pause' && !this.visible && event.visible) {
      this.visible = event.visible;
      this.srct = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext, true);
      const src = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext);
      const cached = await this.mediaService.cached(src);
      if (cached) {
        this.status = 'loading';
        const response = await this.mediaService.download(src);
        if (response.success) {
          this.src = response.url;
          this.status = 'loaded';
        } else {
          this.status = 'error';
        }
      }
    }
  }

  public async onMediaClick(): Promise<void> {
    if (this.status !== 'loading' && this.status !== 'loaded') {
      const src = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext);
      this.status = 'loading';
      const response = await this.mediaService.download(src);
      if (response.success) {
        this.src = response.url;
        this.status = 'loaded';
      } else {
        this.status = 'error';
      }
    }
  }

}
