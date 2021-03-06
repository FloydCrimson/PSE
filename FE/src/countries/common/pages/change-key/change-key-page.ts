import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PasswordCheckerProvider } from 'pse-global-providers';

import { PSEBusyService, PSERouteController } from '@pse-fe/core';

import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import * as RoutesIndex from '@countries/indexes/routes.index';

@Component({
  selector: 'change-key-page',
  templateUrl: 'change-key-page.html',
  styleUrls: ['change-key-page.scss']
})
export class ChangeKeyPage {

  public readonly passwordChecker = PasswordCheckerProvider.getPasswordChecker(['a-z', 'A-Z', '0-9', '@$!%*?&'], '', undefined, 8, 32);

  public readonly changeKeyForm = new FormGroup({
    newPassword: new FormControl('', [], [this.getPasswordValidator.bind(this)]),
    confirmPassword: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

  public readonly changeKeyBusy = this.pseBusyService.check([ChangeKeyPageBusyEnum.ChangeKey]);

  constructor(
    private readonly pseRouteController: PSERouteController,
    private readonly pseBusyService: PSEBusyService,
    private readonly backendAuthRestService: BackendAuthRestService
  ) { }

  public getErrorFromFormGroup(formGroup: FormGroup): { message: string; } {
    for (const control in formGroup.controls) {
      const errors = formGroup.controls[control].errors;
      if (errors && errors.show) {
        return errors.message;
      }
    }
    return undefined;
  }

  // Validators

  private getPasswordValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.changeKeyForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const password: string = control.value;
    if (password.length === 0) {
      return of({ message: 'Password too short.', show: false });
    }
    const newPassword: string = this.changeKeyForm.get('newPassword').value;
    if (newPassword.length > 0 && !this.passwordChecker.test(newPassword)) {
      return of({ message: 'Password invalid. Must be of minimum 8 and maximum 32 characters. Must have at least one uppercase letter, one lowercase letter, one number and one special character.', show: true });
    }
    const confirmPassword: string = this.changeKeyForm.get('confirmPassword').value;
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      return of({ message: 'Confirm Password is different from New Password.', show: true });
    }
    return of(null);
  }

  // Events

  public onChangeKeyClicked(): void {
    const key: string = this.changeKeyForm.get('newPassword').value;
    this.pseBusyService.mark([ChangeKeyPageBusyEnum.ChangeKey]);
    this.backendAuthRestService.ChangeKey(key).pipe(
      finalize(() => this.pseBusyService.unmark([ChangeKeyPageBusyEnum.ChangeKey]))
    ).subscribe(async _ => {
      await this.pseRouteController.navigate('NavigateRoot', RoutesIndex.HomePageRoute, undefined, { animationDirection: 'forward' });
    }, async (error) => {
      alert(JSON.stringify(error));
    });
  }

}

export enum ChangeKeyPageBusyEnum {
  ChangeKey = 'ChangeKey'
}
