import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { PasswordCheckerProvider } from 'global/providers/password-checker.provider';
import { RoutingService } from 'global/services/routing.service';
import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import { BackendAuthRest } from 'countries/common/rests/backend.auth.rest';

import * as RoutesIndex from '@countries/routes.index';

@Component({
  selector: 'unauth-page',
  templateUrl: 'unauth-page.html',
  styleUrls: ['unauth-page.scss']
})
export class UnauthPage {

  passwordChecker = PasswordCheckerProvider.getPasswordChecker(['a-z', 'A-Z', '0-9', '@$!%*?&'], '', undefined, 8, 32);

  signInForm = new FormGroup({
    email: new FormControl('', [], [this.getEmailValidator.bind(this)]),
    nickname: new FormControl('', [], [this.getNicknameValidator.bind(this)])
  });

  logInForm = new FormGroup({
    nickname: new FormControl('', [], [this.getNicknameValidator.bind(this)]),
    password: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

  constructor(
    private readonly routingService: RoutingService,
    private readonly backendAuthRest: BackendAuthRest,
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

  private getEmailValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm || !this.logInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const check = this.signInForm.get('email') === control;
    const email: string = control.value;
    if (email.length === 0) {
      return of({ message: 'Email too short.', show: email.length > 0 });
    }
    return check ? timer(1000).pipe(
      switchMap(_ => this.backendAuthRest.EmailAvailablePOST({ email })),
      map(result => {
        if (result.success) {
          return result.response.output.available ? null : { message: 'Email not available.', show: true };
        } else {
          return { message: 'An error occurred while checking the Email.', show: true };
        }
      })
    ) : of(null);
  }

  private getNicknameValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm || !this.logInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const check = this.signInForm.get('nickname') === control;
    const nickname: string = control.value;
    if (nickname.length < 6) {
      return of({ message: 'Nickname too short.', show: nickname.length > 0 });
    }
    return check ? timer(1000).pipe(
      switchMap(_ => this.backendAuthRest.NicknameAvailablePOST({ nickname })),
      map(result => {
        if (result.success) {
          return result.response.output.available ? null : { message: 'Nickname not available.', show: true };
        } else {
          return { message: 'An error occurred while checking the Nickname.', show: true };
        }
      })
    ) : of(null);
  }

  private getPasswordValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm || !this.logInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const password: string = control.value;
    if (password.length === 0) {
      return of({ message: 'Password too short.', show: false });
    }
    if (!this.passwordChecker.test(password)) {
      return of({ message: 'Password invalid. Must be of minimum 8 and maximum 32 characters. Must have at least one uppercase letter, one lowercase letter, one number and one special character.', show: true });
    }
    return of(null);
  }

  // Events

  public onSignInClicked(): void {
    const email: string = this.signInForm.get('email').value;
    const nickname: string = this.signInForm.get('nickname').value;
    this.backendAuthRestService.SignIn(email, nickname).subscribe(_ => {
      alert('An email with a Temporary Password has been sent to ' + email + '. After you first login you will be asked to change it.');
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onLoginClicked(): void {
    const value: string = this.logInForm.get('nickname').value;
    const key: string = this.logInForm.get('password').value;
    this.backendAuthRestService.LogIn({ type: 'nickname', value, key, algorithm: 'sha256' }).subscribe((result) => {
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
