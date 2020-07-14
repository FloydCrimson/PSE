import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { RepositoryFactoryEndpoint } from '@countries/endpoints/repository-factory.endpoint';
import * as RoutesIndex from '@countries/routes.index';

import { RequestImplementation } from 'global/common/implementations/request.implementation';
import { StorageFactory } from 'global/factories/storage.factory';
import { RepositoryService } from 'global/services/repository.service';
import { RoutingService } from 'global/services/routing.service';

@Component({
  selector: 'unauth-page',
  templateUrl: 'unauth-page.html',
  styleUrls: ['unauth-page.scss'],
})
export class UnauthPage implements OnInit, AfterViewInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  slidesOptions: {} = {};
  credentials: { crypted: string; auth: boolean; };

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
    private readonly storageFactory: StorageFactory,
    private readonly repositoryService: RepositoryService
  ) { }

  public async ngOnInit(): Promise<void> {
    this.credentials = await this.storageFactory.get('PersOutData').get('credentials');
    console.log(this.slides);
  }

  public async ngAfterViewInit(): Promise<void> {
    console.log(this.slides);
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
    if (!this.signInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const email = this.signInForm.get('email').value;
    if (email.length === 0) {
      return of({ message: 'Email too short.', show: email.length > 0 });
    }
    const request: RequestImplementation<{ email: string; }, undefined> = {
      input: { body: { email }, params: undefined },
      options: { cached: false, wait: true }
    };
    return timer(1000).pipe(
      switchMap(_ => this.repositoryService.call('Backend', RepositoryFactoryEndpoint.Backend.Auth.EmailAvailable, request)),
      map(result => {
        console.log(result);
        if (result.success) {
          return result.response.output.email ? null : { message: 'Email not available.', show: true };
        } else {
          return { message: 'An error occurred while checking the Email.', show: true };
        }
      })
    );
  }

  private getNicknameValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const nickname = this.signInForm.get('nickname').value;
    if (nickname.length < 6) {
      return of({ message: 'Nickname too short.', show: nickname.length > 0 });
    }
    const request: RequestImplementation<{ nickname: string; }, undefined> = {
      input: { body: { nickname }, params: undefined },
      options: { cached: false, wait: true }
    };
    return timer(1000).pipe(
      switchMap(_ => this.repositoryService.call('Backend', RepositoryFactoryEndpoint.Backend.Auth.NicknameAvailable, request)),
      map(result => {
        console.log(result);
        if (result.success) {
          return result.response.output.nickname ? null : { message: 'Nickname not available.', show: true };
        } else {
          return { message: 'An error occurred while checking the Nickname.', show: true };
        }
      })
    );
  }

  private getPasswordValidator(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!this.signInForm) {
      return of({ message: 'Form not ready.', show: false });
    }
    const password = this.signInForm.get('password').value;
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
    const request: RequestImplementation<{ email: string; nickname: string; password: string; }, undefined> = { input: { body: { email, nickname, password }, params: undefined }, options: { cached: false, wait: true } };
    this.repositoryService.call('Backend', RepositoryFactoryEndpoint.Backend.Auth.SignIn, request).subscribe(result => {
      console.log(result);
    });
  }

  public onLoginClicked(): void {
    const request: RequestImplementation<undefined, undefined> = { input: undefined, options: { cached: false, wait: true } };
    this.repositoryService.call('Backend', RepositoryFactoryEndpoint.Backend.Auth.LogIn, request).subscribe(result => {
      console.log(result);
    });
  }

}
