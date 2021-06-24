import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { PlatformEnum } from 'global/common/enum/platform.enum';

@Injectable({
    providedIn: 'root'
})
export class PlatformService {

    constructor(
        private readonly platform: Platform
    ) { }

    public ready(): Promise<string> {
        return this.platform.ready();
    }

    public getPlatform(): PlatformEnum {
        let platformEnum: PlatformEnum = PlatformEnum.Unknown;
        if (this.platform.is('desktop')) {
            platformEnum |= PlatformEnum.Desktop;
            platformEnum |= PlatformEnum.Browser;
        } else {
            if (this.platform.is('mobileweb')) {
                platformEnum |= PlatformEnum.Browser;
            } else {
                platformEnum |= PlatformEnum.Mobile;
            }
            if (this.platform.is('android')) {
                platformEnum |= PlatformEnum.Android;
            } else if (this.platform.is('ios')) {
                platformEnum |= PlatformEnum.iOS;
            }
        }
        return platformEnum;
    }

    public isPlatform(platformEnum: PlatformEnum): boolean {
        return (this.getPlatform() & platformEnum) === platformEnum;
    }

}
