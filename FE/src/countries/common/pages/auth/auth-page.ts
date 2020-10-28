import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { RoutingService } from 'global/services/routing.service';
import { StorageFactory } from 'global/factories/storage.factory';
import { SessionService } from 'global/services/session.service';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'auth-page',
  templateUrl: 'auth-page.html',
  styleUrls: ['auth-page.scss'],
})
export class AuthPage {

  loginForm = new FormGroup({
    password: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

  constructor(
    private readonly routingService: RoutingService,
    private readonly storageFactory: StorageFactory,
    private readonly sessionService: SessionService
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
    if (!this.loginForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const password = control.value;
    if (password.length === 0) {
      return of({ message: 'Password too short.', show: password.length > 0 });
    }
    return of(null);
  }

  // Events

  public async onLoginClicked(): Promise<void> {
    const key = this.loginForm.get('password').value;
    const { type, value } = await this.storageFactory.get('PersOutData').get('auth');
    this.sessionService.login({ type, value, key, algorithm: 'sha256' }).subscribe((result) => {
      if (result) {
        this.routingService.navigate('NavigateRoot', RoutesIndex.HomePageRoute, { input: { title: 'AuthPage' } }, { animationDirection: 'forward' });
      }
    });
  }

}
