import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { environment } from '@environments/environment';

import { EnvironmentImplementation } from 'environments/common/implementations/environment.implementation';

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

    public getPlatform(): 'Android' | 'iOS' | 'Browser' {
        if (this.platform.is('mobileweb')) { // WARNING: This just checks for mobile web (e.g. no desktop browser)
            return 'Browser';
        }
        else if (this.platform.is('ios')) {
            return 'iOS';
        } else if (this.platform.is('android')) {
            return 'Android';
        } else {
            return null;
        }
    }

}
