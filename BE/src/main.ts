import { InitializeImplementation } from './protocols/rest/implementations/initialize.implementation';
import { InitializeService as InitializeRestService } from './protocols/rest/services/initialize.service';

const initializeServices: { service: InitializeImplementation, port: number }[] = [
    { service: new InitializeRestService(), port: 3001 }
];

// const openWebSocketServer: (port: number) => Promise<boolean> = (port: number) => {
//     return new Promise<boolean>((resolve, reject) => {

//         const app = express();

//         const server = http.createServer(app);
//         const wss = new WebSocket.Server({ server });
//         wss.on('connection', (ws: WebSocket) => {
//             ws.on('message', (message: string) => {
//                 console.log('received: %s', message);
//                 ws.send(`Hello, you sent -> ${message}`);
//             });
//             ws.send('Hi there, I am a WebSocket server');
//         });

//         server.listen(port, (...args: any[]) => {
//             console.log(`Express WebSocket server has started on port ${server.address().port}.`);
//             console.log('Params', args);
//             resolve(true);
//         });

//     });
// };

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
