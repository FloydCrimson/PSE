import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, IonSlides } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map, finalize } from 'rxjs/operators';
import { PasswordCheckerProvider } from 'pse-global-providers';

import { PSEBusyService, PSELoadingService, PSERouteController } from '@pse-fe/core';

import { BackendAuthRestService } from 'countries/common/rests/backend.auth.rest.service';

import { BackendAuthRest } from 'countries/common/rests/backend.auth.rest';

import * as LoadersIndex from '@countries/indexes/loaders.index';
import * as RoutesIndex from '@countries/indexes/routes.index';

@Component({
  selector: 'unauth-page',
  templateUrl: 'unauth-page.html',
  styleUrls: ['unauth-page.scss']
})
export class UnauthPage implements OnDestroy {

  public readonly passwordChecker = PasswordCheckerProvider.getPasswordChecker(['a-z', 'A-Z', '0-9', '@$!%*?&'], '', undefined, 8, 32);

  public readonly signInForm = new FormGroup({
    email: new FormControl('', [], [this.getEmailValidator.bind(this)]),
    nickname: new FormControl('', [], [this.getNicknameValidator.bind(this)])
  });

  public readonly logInForm = new FormGroup({
    nickname: new FormControl('', [], [this.getNicknameValidator.bind(this)]),
    password: new FormControl('', [], [this.getPasswordValidator.bind(this)])
  });

  public readonly signInBusy = this.pseBusyService.check([UnauthPageBusyEnum.SignIn]);
  public readonly logInBusy = this.pseBusyService.check([UnauthPageBusyEnum.LogIn]);

  private readonly loadingSubscription = this.pseLoadingService.subscribe([UnauthPageBusyEnum.SignIn, UnauthPageBusyEnum.LogIn], LoadersIndex.MainLoader);

  @ViewChild(IonSlides) public ionSlides: IonSlides;

  constructor(
    private readonly pseRouteController: PSERouteController,
    private readonly pseBusyService: PSEBusyService,
    private readonly pseLoadingService: PSELoadingService,
    private readonly backendAuthRest: BackendAuthRest,
    private readonly backendAuthRestService: BackendAuthRestService,
    private readonly translateService: TranslateService,
    private readonly alertController: AlertController
  ) { }

  public ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

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

  public async onToolbarClicked(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Select language',
      inputs: this.translateService.getLangs().map((language) => {
        return {
          type: 'radio',
          label: this.translateService.instant('LANGUAGE.' + language.toUpperCase()),
          value: language,
          checked: language === this.translateService.currentLang
        };
      }),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          role: 'ok'
        }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss<{ values: string; }>();
    if (result.role === 'ok' && result.data.values !== this.translateService.currentLang) {
      await this.translateService.use(result.data.values).toPromise();
    }
  }

  public onSignInClicked(): void {
    const email: string = this.signInForm.get('email').value;
    const nickname: string = this.signInForm.get('nickname').value;
    this.pseBusyService.mark([UnauthPageBusyEnum.SignIn]);
    this.backendAuthRestService.SignIn(email, nickname).pipe(
      finalize(() => this.pseBusyService.unmark([UnauthPageBusyEnum.SignIn]))
    ).subscribe(async _ => {
      alert('An email with a Temporary Password has been sent to ' + email + '. After you first login you will be asked to change it.');
      await this.ionSlides.slideTo(1);
      this.logInForm.get('nickname').setValue(this.signInForm.get('nickname').value);
      this.logInForm.get('password').setValue('');
      this.signInForm.get('email').setValue('');
      this.signInForm.get('nickname').setValue('');
    }, async (error) => {
      alert(JSON.stringify(error));
    });
  }

  public onLoginClicked(): void {
    const value: string = this.logInForm.get('nickname').value;
    const key: string = this.logInForm.get('password').value;
    this.pseBusyService.mark([UnauthPageBusyEnum.LogIn]);
    this.backendAuthRestService.LogIn({ type: 'nickname', value, key, algorithm: 'sha256' }).pipe(
      finalize(() => this.pseBusyService.unmark([UnauthPageBusyEnum.LogIn]))
    ).subscribe(async (result) => {
      if (result.authenticated) {
        await this.pseRouteController.navigate('NavigateRoot', RoutesIndex.HomePageRoute, undefined, { animationDirection: 'forward' });
      } else {
        await this.pseRouteController.navigate('NavigateRoot', RoutesIndex.ChangeKeyPageRoute, undefined, { animationDirection: 'forward' });
      }
    }, async (error) => {
      alert(JSON.stringify(error));
    });
  }

}

export enum UnauthPageBusyEnum {
  SignIn = 'SignIn',
  LogIn = 'LogIn'
}
