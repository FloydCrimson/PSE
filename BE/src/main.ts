import { InitializeImplementation } from './protocols/common/implementations/initialize.implementation';
import { InitializeService as InitializeRestService } from './protocols/rest/services/initialize.service';
import { InitializeService as InitializeWebSocketService } from './protocols/web-socket/services/initialize.service';

const initializeServices: { service: InitializeImplementation, port: number }[] = [
    { service: new InitializeRestService(), port: 3000 },
    { service: new InitializeWebSocketService(), port: 4000 }
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

initialize(initializeServices.map(is => is.service.initialize(is.port))).then(resolved => {
    if (resolved) {
        console.log('All servers have started.');
    } else {
        console.log('One or more servers have not started.');
    }
});
