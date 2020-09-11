import { fork, ChildProcess } from 'child_process';
import * as path from 'path';

import { CommunicationServerService } from './global/services/communication.service';

import { CommunicationImplementationType } from './protocols/common/implementations/communication.implementation.type';

const map = new Map<keyof CommunicationImplementationType, ChildProcess>();
new Array<keyof CommunicationImplementationType>('database', 'rest', 'socket').forEach((configuration) => {
    const child = fork(path.resolve(__dirname, 'main.' + configuration + '.js'), [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
    map.set(configuration, child);
});

const communicationServerService = new CommunicationServerService<CommunicationImplementationType>(map);
communicationServerService.dispatch();
