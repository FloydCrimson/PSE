import { AuthMethodImplementation } from './auth.implementation';

import { DispatcherService } from '../../../services/dispatcher.service';

export class AuthMethod implements AuthMethodImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async test(): Promise<boolean> {
        return true;
    }

};
