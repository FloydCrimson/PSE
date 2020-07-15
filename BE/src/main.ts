import { InitializeImplementation } from './global/common/implementations/initialize.implementation';
import { DispatcherService } from './global/services/dispatcher.service';
import { InitializeService as InitializeDatabaseService } from './protocols/database/services/initialize.service';
import { InitializeService as InitializeRestService } from './protocols/rest/services/initialize.service';
import { InitializeService as InitializeWebSocketService } from './protocols/web-socket/services/initialize.service';

const dispatcherService: DispatcherService = new DispatcherService();

const initializeServices: { service: InitializeImplementation, port?: number }[] = [
    { service: new InitializeDatabaseService(dispatcherService) },
    { service: new InitializeRestService(dispatcherService), port: 3000 },
    { service: new InitializeWebSocketService(dispatcherService), port: 4000 }
];

const initialize: (promises: Promise<boolean>[]) => Promise<boolean> = (promises: Promise<boolean>[]) => {
    return new Promise<boolean>((resolve, reject) => {
        Promise.all(promises).then((resolved) => {
            resolve(resolved.reduce((r, e) => r && e, true));
        }, (rejected) => {
            resolve(false);
        }).catch((caught) => {
            resolve(false);
        });
    });
}

initialize(initializeServices.map(initializeService => initializeService.service.initialize(initializeService.port))).then(resolved => {
    if (resolved) {
        console.log('All servers have started.');
    } else {
        console.error('One or more servers have not started.');
    }
});
