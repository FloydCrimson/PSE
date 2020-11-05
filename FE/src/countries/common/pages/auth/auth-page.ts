import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { PasswordCheckerProvider } from 'global/providers/password-checker.provider';
import { RoutingService } from 'global/services/routing.service';
import { StorageFactory } from 'global/factories/storage.factory';
import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'auth-page',
  templateUrl: 'auth-page.html',
  styleUrls: ['auth-page.scss']
})
export class AuthPage {

  passwordChecker = PasswordCheckerProvider.getPasswordChecker(['a-z', 'A-Z', '0-9', '@$!%*?&'], '', undefined, 8, 32);

  logInForm = new FormGroup({
    password: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

  constructor(
    private readonly routingService: RoutingService,
    private readonly storageFactory: StorageFactory,
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
    if (!this.logInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const password: string = control.value;
    if (password.length === 0) {
      return of({ message: 'Password too short.', show: false });
    }
    if (!this.passwordChecker.test(password)) {
      return of({ message: 'Password invalid. Must be of minimum 8 and maximum 32 characters. Must have at least one uppercase letter, one lowercase letter, one number and one special character.', show: false });
    }
    return of(null);
  }

  // Events

  public async onLogInClicked(): Promise<void> {
    const key: string = this.logInForm.get('password').value;
    const { type, value } = await this.storageFactory.get('PersData').get('auth');
    this.backendAuthRestService.LogIn({ type, value, key, algorithm: 'sha256' }).subscribe((result) => {
      if (result.authenticated) {
        this.routingService.navigate('NavigateRoot', RoutesIndex.HomePageRoute, undefined, { animationDirection: 'forward' });
      } else {
        this.routingService.navigate('NavigateRoot', RoutesIndex.ChangeKeyPageRoute, undefined, { animationDirection: 'forward' });
      }
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

}
