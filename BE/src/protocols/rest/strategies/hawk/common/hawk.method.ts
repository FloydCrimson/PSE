import { HawkMethodImplementation } from './hawk.implementation';

import { DispatcherService } from '../../../services/dispatcher.service';

export class HawkMethod implements HawkMethodImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async test(): Promise<boolean> {
        return true;
    }

};
