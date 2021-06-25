import { Request } from '@hapi/hapi';
import { CoderProvider } from 'pse-global-providers';

import { HawkMethodImplementation } from './hawk.implementation';

import { DispatcherService } from '../../../services/dispatcher.service';

export class HawkMethod implements HawkMethodImplementation {

    public static ATTEMPS_MAX: number = 3;

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async credentialsFunc(encoded: string): Promise<any> {
        const decoded = JSON.parse(CoderProvider.decode(encoded));
        if ('id' in decoded || 'email' in decoded || 'nickname' in decoded) {
            return this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', decoded, { relations: ['user'] });
        }
        return undefined;
    }

    public requestMapper(request: Request): any {
        return {
            headers: request.headers,
            method: request.method,
            url: request.url.toString()
        };
    }

}
