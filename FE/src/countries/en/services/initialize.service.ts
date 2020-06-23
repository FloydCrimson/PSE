import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { InitializeImplementation } from 'global/common/implementations/initialize.implementation';
import { PlatformEnum } from 'global/common/enum/platform.enum';

import { EnvironmentService } from 'global/services/environment.service';

import { StorageFactory } from 'global/factories/storage.factory';
import { StorageImplementation } from 'global/common/implementations/factories/storage.implementation';
import * as SFT from 'global/factories/storage.factory.type';
import { IonicStorage } from 'global/factories/storages/ionic.storage';
import { BuiltInStorage } from 'global/factories/storages/built-in.storage';
import { JSStorage } from 'global/factories/storages/js.storage';

import { RepositoryFactory } from 'global/factories/repository.factory';
import { RepositoryImplementation } from 'global/common/implementations/factories/repository.implementation';
import * as RFT from 'global/factories/repository.factory.type';
import { AngularHttpRepository } from 'global/factories/repositories/angular-http.repository';
import { NativeHttpRepository } from 'global/factories/repositories/native-http.repository';

@Injectable({
    providedIn: 'root'
})
export class InitializeService implements InitializeImplementation {

    constructor(
        private readonly environmentService: EnvironmentService,
        private readonly storageFactory: StorageFactory,
        private readonly repositoryFactory: RepositoryFactory,
        private readonly storage: Storage,
        private readonly nativeStorage: NativeStorage,
        private readonly httpBrowser: HttpClient,
        private readonly httpNative: HTTP
    ) { }

    public initialize(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises: Promise<boolean>[] = [];
            promises.push(...this.initializeStorages());
            promises.push(...this.initializeRepositories());
            Promise.all(promises).then((resolved) => {
                resolve(resolved.reduce((r, e) => r && e, true));
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    private initializeStorages(): Promise<boolean>[] {
        this.storageFactory.clear();
        const storages: [keyof SFT.StorageFactoryTypes, StorageImplementation<SFT.StorageFactoryTypes[keyof SFT.StorageFactoryTypes]>][] = [];
        storages.push(['PersOutData', this.environmentService.getPlatform() === PlatformEnum.Browser ? new IonicStorage<SFT.StorageFactoryTypePersOutData>(this.storage) : new BuiltInStorage<SFT.StorageFactoryTypePersOutData>(this.nativeStorage)]);
        storages.push(['TempOutData', new JSStorage<SFT.StorageFactoryTypesTempOutData>()]);
        storages.push(['TempInData', new JSStorage<SFT.StorageFactoryTypesTempInData>()]);
        const check = storages.reduce((r, s) => this.storageFactory.set(s[0], s[1]) && r, true);
        if (check) {
            return storages.map((s) => this.storageFactory.get(s[0]).ready());
        } else {
            return [Promise.resolve(false)];
        }
    }

    private initializeRepositories(): Promise<boolean>[] {
        this.repositoryFactory.clear();
        const repositories: [keyof RFT.RepositoryFactoryTypes, RepositoryImplementation][] = [];
        repositories.push(['Backend', this.environmentService.getPlatform() === PlatformEnum.Browser ? new AngularHttpRepository(this.httpBrowser) : new NativeHttpRepository(this.httpNative)]);
        const check = repositories.reduce((r, s) => this.repositoryFactory.set(s[0], s[1]) && r, true);
        return [Promise.resolve(check)];
    }

}
