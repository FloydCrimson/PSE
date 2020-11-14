import { Component, Input, OnInit } from '@angular/core';

import { ModalService } from 'global/services/modal.service';

import * as ModalsIndex from '@countries/modals.index';

@Component({
  selector: 'overlay-component',
  templateUrl: 'overlay-component.html',
  styleUrls: ['overlay-component.scss']
})
export class OverlayComponent implements OnInit {

  @Input('text')
  text: string;

  constructor(
    private readonly modalService: ModalService
  ) { }

  public ngOnInit(): void {
    console.log('OverlayComponent', this.text);
  }

  public dismiss(): void {
    this.modalService.dismiss(ModalsIndex.OverlayComponentModal, { result: true });
  }

}
