import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { InitializeImplementation } from 'global/common/implementations/initialize.implementation';
import { PlatformEnum } from 'global/common/enum/platform.enum';

import { PlatformService } from 'global/services/platform.service';

import { StorageFactory } from 'global/factories/storage.factory';
import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';
import * as StorageFT from 'global/factories/storage.factory.type';
import { IonicStorage } from 'global/factories/storages/ionic.storage';
import { BuiltInStorage } from 'global/factories/storages/built-in.storage';
import { JSStorage } from 'global/factories/storages/js.storage';

import { RestFactory } from 'global/factories/rest.factory';
import { RestFactoryImplementation } from 'global/common/implementations/factories/rest.factory.implementation';
import * as RestFT from 'global/factories/rest.factory.type';
import { AngularRest } from 'global/factories/rests/angular.rest';
import { NativeRest } from 'global/factories/rests/native.rest';
import { SocketFactory } from 'global/factories/socket.factory';
import { SocketFactoryImplementation } from 'global/common/implementations/factories/socket.factory.implementation';
import * as SocketFT from 'global/factories/socket.factory.type';
import { AngularSocket } from 'global/factories/sockets/angular.socket';

@Injectable({
    providedIn: 'root'
})
export class InitializeService implements InitializeImplementation {

    constructor(
        private readonly platformService: PlatformService,
        private readonly storageFactory: StorageFactory,
        private readonly restFactory: RestFactory,
        private readonly socketFactory: SocketFactory,
        private readonly storage: Storage,
        private readonly nativeStorage: NativeStorage,
        private readonly httpBrowser: HttpClient,
        private readonly httpNative: HTTP
    ) { }

    public initialize(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const promises: Promise<boolean>[] = [];
            promises.push(...this.initializeStorages());
            promises.push(...this.initializeRests());
            promises.push(...this.initializeSockets());
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
        const storages: [keyof StorageFT.StorageFactoryTypes, StorageFactoryImplementation<StorageFT.StorageFactoryTypes[keyof StorageFT.StorageFactoryTypes]>][] = [];
        storages.push(['PersOutData', this.platformService.isPlatform(PlatformEnum.Browser) ? new IonicStorage<StorageFT.StorageFactoryTypePersOutData>(this.storage) : new BuiltInStorage<StorageFT.StorageFactoryTypePersOutData>(this.nativeStorage)]);
        storages.push(['TempOutData', new JSStorage<StorageFT.StorageFactoryTypesTempOutData>()]);
        storages.push(['TempInData', new JSStorage<StorageFT.StorageFactoryTypesTempInData>()]);
        const check = storages.reduce((r, s) => this.storageFactory.set(s[0], s[1]) && r, true);
        if (check) {
            return storages.map((s) => this.storageFactory.get(s[0]).ready());
        } else {
            return [Promise.resolve(false)];
        }
    }

    private initializeRests(): Promise<boolean>[] {
        this.restFactory.clear();
        const rests: [keyof RestFT.RestFactoryTypes, RestFactoryImplementation][] = [];
        rests.push(['Backend', this.platformService.isPlatform(PlatformEnum.Browser) ? new AngularRest(this.httpBrowser, this.storageFactory) : new NativeRest(this.httpNative, this.storageFactory)]);
        const check = rests.reduce((r, s) => this.restFactory.set(s[0], s[1]) && r, true);
        return [Promise.resolve(check)];
    }

    private initializeSockets(): Promise<boolean>[] {
        this.socketFactory.clear();
        const sockets: [keyof SocketFT.SocketFactoryTypes, SocketFactoryImplementation][] = [];
        sockets.push(['Backend', new AngularSocket(this.storageFactory)]);
        const check = sockets.reduce((r, s) => this.socketFactory.set(s[0], s[1]) && r, true);
        return [Promise.resolve(check)];
    }

}
