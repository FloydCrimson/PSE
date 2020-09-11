import { Component, Input, OnInit } from '@angular/core';

import { ModalService } from 'global/services/modal.service';

import * as ModalsIndex from '@countries/modals.index';

@Component({
  selector: 'overlay-page',
  templateUrl: 'overlay-page.html',
  styleUrls: ['overlay-page.scss'],
})
export class OverlayPage implements OnInit {

  @Input('text') text: string;

  constructor(
    private readonly modalService: ModalService
  ) { }

  public ngOnInit(): void {
    console.log('OverlayPage', this.text);
  }

  public dismiss(): void {
    this.modalService.dismiss(ModalsIndex.OverlayPageModal, { result: true });
  }

}
