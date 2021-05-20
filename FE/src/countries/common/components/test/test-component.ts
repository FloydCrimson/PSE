import { Component, Input } from '@angular/core';

import { PSEModalController } from '@pse-fe/core';

import * as ModalsIndex from '@countries/modals.index';

@Component({
  selector: 'test-component',
  templateUrl: 'test-component.html',
  styleUrls: ['test-component.scss']
})
export class TestComponent {

  @Input('message') public message: string;

  constructor(
    private readonly pseModalController: PSEModalController
  ) { }

  // Events

  public onButtonClicked(): void {
    const result = PSEModalController.getResults(ModalsIndex.TestComponentModal);
    result.output = { message: this.message };
    this.pseModalController.dismiss(ModalsIndex.TestComponentModal, result);
  }

}
