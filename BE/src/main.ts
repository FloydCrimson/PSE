import * as protocolsconfig from '../protocolsconfig.json';

import { InitializeImplementation } from './global/common/implementations/initialize.implementation';
import { DispatcherService } from './global/services/dispatcher.service';
import { InitializeService as InitializeDatabaseService } from './protocols/database/services/initialize.service';
import { InitializeService as InitializeRestService } from './protocols/rest/services/initialize.service';
import { InitializeService as InitializeWebSocketService } from './protocols/web-socket/services/initialize.service';

const dispatcherService: DispatcherService = new DispatcherService();

const initializeServices: { service: InitializeImplementation, configurations: string }[] = [
    { service: new InitializeDatabaseService(dispatcherService), configurations: 'database' },
    { service: new InitializeRestService(dispatcherService), configurations: 'rest' },
    { service: new InitializeWebSocketService(dispatcherService), configurations: 'web-socket' }
];

const initialize: (promises: Promise<boolean>[]) => Promise<boolean> = (promises: Promise<boolean>[]) => {
    return new Promise<boolean>((resolve, reject) => {
        Promise.all(promises).then((resolved) => {
            resolve(!resolved.some(c => !c));
        }, (rejected) => {
            reject(rejected);
        }).catch((caught) => {
            reject(caught);
        });
    });
}

initialize(initializeServices.map(initializeService => initializeService.service.initialize(protocolsconfig[initializeService.configurations]))).then((resolved) => {
    if (resolved) {
        console.log('All servers have started.');
    } else {
        console.error('One or more servers have not started.');
    }
}, (rejected) => {
    console.error('One or more servers have not started.', rejected);
});
