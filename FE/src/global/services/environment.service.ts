import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { environment } from '@environments/environment';

import { EnvironmentImplementation } from 'environments/common/implementations/environment.implementation';
import { PlatformEnum } from 'global/common/enum/platform.enum';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    constructor(
        private readonly platform: Platform
    ) { }

    public getEnvironment(): EnvironmentImplementation {
        return environment;
    }

    public getPlatform(): PlatformEnum {
        let platformEnum: PlatformEnum = PlatformEnum.Unknown;
        if (this.platform.is('mobileweb')) {
            platformEnum |= PlatformEnum.Mobile;
        } else {
            platformEnum |= PlatformEnum.Browser;
        }
        if (this.platform.is('android')) {
            platformEnum |= PlatformEnum.Android;
        }
        if (this.platform.is('ios')) {
            platformEnum |= PlatformEnum.iOS;
        }
        return platformEnum;
    }

}
