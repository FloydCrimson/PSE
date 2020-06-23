import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { EnvironmentImplementation } from 'environments/common/implementations/environment.implementation';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {

    constructor() { }

    public getEnvironment(): EnvironmentImplementation {
        return environment;
    }

}
