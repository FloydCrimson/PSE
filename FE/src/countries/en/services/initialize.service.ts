import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateService } from '@ngx-translate/core';

import { PSELanguageService } from '@pse-fe/core';

import { CountryConfig } from '@countries/country';

import { InitializeImplementation } from 'global/common/implementations/initialize.implementation';
import { PlatformEnum } from 'global/common/enum/platform.enum';

import { PlatformService } from 'global/services/platform.service';
import { LoggingService } from 'global/services/logging.service';

import { PersistentStorageFactory } from 'global/factories/persistent-storages.factory';
import { PersistentStorageFactoryImplementation } from 'global/common/implementations/factories/persistent-storage.factory.implementation';
import * as PStorageFT from 'global/factories/persistent-storages.factory.type';
import { IonicStorage } from 'global/factories/persistent-storages/ionic.storage';
import { CapacitorStorage } from 'global/factories/persistent-storages/capacitor.storage';

import { EphemeralStorageFactory } from 'global/factories/ephemeral-storages.factory';
import { EphemeralStorageFactoryImplementation } from 'global/common/implementations/factories/ephemeral-storage.factory.implementation';
import * as EStorageFT from 'global/factories/ephemeral-storages.factory.type';
import { JSStorage } from 'global/factories/ephemeral-storages/js.storage';

import { RestFactory } from 'global/factories/rest.factory';
import { RestFactoryImplementation } from 'global/common/implementations/factories/rest.factory.implementation';
import * as RestFT from 'global/factories/rest.factory.type';
import { AngularRest } from 'global/factories/rests/angular.rest';
import { NativeRest } from 'global/factories/rests/native.rest';
import { SocketFactory } from 'global/factories/socket.factory';
import { SocketFactoryImplementation } from 'global/common/implementations/factories/socket.factory.implementation';
import * as SocketFT from 'global/factories/socket.factory.type';
import { AngularSocket } from 'global/factories/sockets/angular.socket';

const URLs = new Array<[string, 'O' | 'C' | 'L']>(
    ['info.json', 'O'],
    ['language.json', 'O'],
    ['alert.json', 'C']
);

@Injectable({
    providedIn: 'root'
})
export class InitializeService implements InitializeImplementation {

    constructor(
        private readonly platformService: PlatformService,
        private readonly pStorageFactory: PersistentStorageFactory,
        private readonly eStorageFactory: EphemeralStorageFactory,
        private readonly restFactory: RestFactory,
        private readonly socketFactory: SocketFactory,
        private readonly loggingService: LoggingService,
        private readonly storage: Storage,
        private readonly httpBrowser: HttpClient,
        private readonly httpNative: HTTP,
        private readonly pseLanguageService: PSELanguageService,
        private readonly translateService: TranslateService
    ) { }

    public initialize(): Promise<boolean> {
        const promises: Promise<boolean>[] = [];
        promises.push(...this.initializePersistentStorages());
        promises.push(...this.initializeEphemeralStorages());
        promises.push(...this.initializeRests());
        promises.push(...this.initializeSockets());
        promises.push(...this.initializeTranslate());
        return Promise.all(promises).then((resolved) => !resolved.some((r) => !r));
    }

    private initializePersistentStorages(): Promise<boolean>[] {
        this.pStorageFactory.clear();
        const storages: [keyof PStorageFT.PersistentStorageFactoryTypes, PersistentStorageFactoryImplementation<PStorageFT.PersistentStorageFactoryTypes[keyof PStorageFT.PersistentStorageFactoryTypes]>][] = [];
        storages.push(['Local', this.platformService.isPlatform(PlatformEnum.Browser) ? new IonicStorage<PStorageFT.PersistentStorageFactoryTypeLocal>(this.storage) : new CapacitorStorage<PStorageFT.PersistentStorageFactoryTypeLocal>()]);
        const check = !storages.some(([t, f]) => !this.pStorageFactory.set(t, f));
        return [Promise.resolve(check && !storages.some(([, s]) => !s.ready()))];
    }

    private initializeEphemeralStorages(): Promise<boolean>[] {
        this.eStorageFactory.clear();
        const storages: [keyof EStorageFT.EphemeralStorageFactoryTypes, EphemeralStorageFactoryImplementation<EStorageFT.EphemeralStorageFactoryTypes[keyof EStorageFT.EphemeralStorageFactoryTypes]>][] = [];
        storages.push(['Out', new JSStorage<EStorageFT.EphemeralStorageFactoryTypeOut>()]);
        storages.push(['In', new JSStorage<EStorageFT.EphemeralStorageFactoryTypeIn>()]);
        const check = !storages.some(([t, f]) => !this.eStorageFactory.set(t, f));
        return [Promise.resolve(check && !storages.some(([, s]) => !s.ready()))];
    }

    private initializeRests(): Promise<boolean>[] {
        this.restFactory.clear();
        const rests: [keyof RestFT.RestFactoryTypes, RestFactoryImplementation][] = [];
        rests.push(['Backend', this.platformService.isPlatform(PlatformEnum.Browser) ? new AngularRest(this.httpBrowser) : new NativeRest(this.httpNative)]);
        const check = !rests.some(([t, f]) => !this.restFactory.set(t, f));
        return [Promise.resolve(check)];
    }

    private initializeSockets(): Promise<boolean>[] {
        this.socketFactory.clear();
        const sockets: [keyof SocketFT.SocketFactoryTypes, SocketFactoryImplementation][] = [];
        sockets.push(['Backend', new AngularSocket(this.loggingService)]);
        const check = !sockets.some(([t, f]) => !this.socketFactory.set(t, f));
        return [Promise.resolve(check)];
    }

    private initializeTranslate(): Promise<boolean>[] {
        this.pseLanguageService.addURLs(URLs);
        this.translateService.setDefaultLang(CountryConfig.defaultLanguage);
        const result = this.translateService.use(CountryConfig.defaultLanguage).toPromise().then(_ => true).catch(_ => false);
        return [result];
    }

}
