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

  signInForm = new FormGroup({
    email: new FormControl('', [], [this.getEmailValidator.bind(this)]),
    nickname: new FormControl('', [], [this.getNicknameValidator.bind(this)]),
    password: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

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

  private getEmailValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm || !this.loginForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const check = this.signInForm.get('email') === control;
    const email = control.value;
    if (email.length === 0) {
      return of({ message: 'Email too short.', show: email.length > 0 });
    }
    return check ? timer(1000).pipe(
      switchMap(_ => this.backendAuthRest.EmailAvailablePOST({ email })),
      map(result => {
        if (result.success) {
          return result.response.output.email ? null : { message: 'Email not available.', show: true };
        } else {
          return { message: 'An error occurred while checking the Email.', show: true };
        }
      })
    ) : of(null);
  }

  private getNicknameValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm || !this.loginForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const check = this.signInForm.get('nickname') === control;
    const nickname = control.value;
    if (nickname.length < 6) {
      return of({ message: 'Nickname too short.', show: nickname.length > 0 });
    }
    return check ? timer(1000).pipe(
      switchMap(_ => this.backendAuthRest.NicknameAvailablePOST({ nickname })),
      map(result => {
        if (result.success) {
          return result.response.output.nickname ? null : { message: 'Nickname not available.', show: true };
        } else {
          return { message: 'An error occurred while checking the Nickname.', show: true };
        }
      })
    ) : of(null);
  }

  private getPasswordValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm || !this.loginForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const password = control.value;
    if (password.length === 0) {
      return of({ message: 'Password too short.', show: password.length > 0 });
    }
    return of(null)
  }

  // Events

  public onSignInClicked(): void {
    const email = this.signInForm.get('email').value;
    const nickname = this.signInForm.get('nickname').value;
    const password = this.signInForm.get('password').value;
    this.backendAuthRest.SignInPOST({ email, nickname, password }).subscribe((result) => {
      console.log(result);
    });
  }

  public onLoginClicked(): void {
    forkJoin(
      of(this.loginForm.get('nickname').value),
      of(this.loginForm.get('password').value)
    ).pipe(
      exhaustMap(([value, key]) => this.sessionService.login({ type: 'nickname', value, key, algorithm: 'sha256' }))
    ).subscribe((result) => {
      if (result) {
        this.routingService.navigateForward(RoutesIndex.HomePageRoute);
      }
    });
  }

}
