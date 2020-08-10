import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, from, forkJoin } from 'rxjs';

import { RoutingService } from 'global/services/routing.service';
import { StorageFactory } from 'global/factories/storage.factory';
import { SessionService } from 'global/services/session.service';

import * as RoutesIndex from '@countries/routes.index';
import { exhaustMap } from 'rxjs/operators';

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
    return of(null)
  }

  // Events

  public onLoginClicked(): void {
    forkJoin(
      from(this.storageFactory.get('PersOutData').get('auth')),
      of(this.loginForm.get('password').value)
    ).pipe(
      exhaustMap(([{ type, value }, key]) => this.sessionService.login({ type, value, key, algorithm: 'sha256' }))
    ).subscribe((result) => {
      if (result) {
        this.routingService.navigate('Forward', RoutesIndex.BoardPageRoute, undefined, { animationDirection: 'forward' });
      }
    });
  }

}
