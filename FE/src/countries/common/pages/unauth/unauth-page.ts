import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer, forkJoin } from 'rxjs';
import { switchMap, map, exhaustMap } from 'rxjs/operators';

import { RoutingService } from 'global/services/routing.service';
import { SessionService } from 'global/services/session.service';

import { BackendAuthRest } from 'countries/common/rests/backend.auth.rest';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'unauth-page',
  templateUrl: 'unauth-page.html',
  styleUrls: ['unauth-page.scss'],
})
export class UnauthPage {

  loginForm = new FormGroup({
    nickname: new FormControl('', [], [this.getNicknameValidator.bind(this)]),
    password: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

  constructor(
    private readonly routingService: RoutingService,
    private readonly backendAuthRest: BackendAuthRest,
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

  private getNicknameValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.loginForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const nickname = control.value;
    if (nickname.length < 6) {
      return of({ message: 'Nickname too short.', show: nickname.length > 0 });
    }
    return of(null);
  }

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
      of(this.loginForm.get('nickname').value),
      of(this.loginForm.get('password').value)
    ).pipe(
      exhaustMap(([value, key]) => this.sessionService.login({ type: 'nickname', value, key, algorithm: 'sha256' }))
    ).subscribe((result) => {
      if (result) {
        this.routingService.navigate('Root', RoutesIndex.BoardPageRoute, undefined, { animationDirection: 'forward' });
      }
    });
  }

}
