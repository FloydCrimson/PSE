import { Component } from '@angular/core';

import { ModalService } from 'global/services/modal.service';

import * as ModalsIndex from '@countries/modals.index';

@Component({
  selector: 'overlay-page',
  templateUrl: 'overlay-page.html',
  styleUrls: ['overlay-page.scss'],
})
export class OverlayPage {

  constructor(
    private readonly modalService: ModalService
  ) { }

  public dismiss(): void {
    this.modalService.dismiss(ModalsIndex.OverlayPageModal, { result: true });
  }

}
