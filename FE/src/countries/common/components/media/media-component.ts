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
        await this.download(src);
      }
    }
  }

  public async onMediaClick(): Promise<void> {
    if (this.status !== 'loading' && this.status !== 'loaded') {
      const src = FChanFactoryImplementation.getUserImageUrl(this.board.board, this.media.tim, this.media.ext);
      await this.download(src);
    }
  }

  private async download(src: string): Promise<void> {
    this.status = 'loading';
    const responseD = await this.mediaService.download(src);
    if (responseD.success) {
      // if (this.type === 'video') {
      //   const responseC = await this.mediaService.convert(src, '.mp4');
      //   if (responseC.success) {
      //     this.src = responseC.url;
      //   } else {
      //     this.src = responseD.url;
      //   }
      // } else {
        this.src = responseD.url;
      // }
      this.status = 'loaded';
    } else {
      this.status = 'error';
    }
  }

}
