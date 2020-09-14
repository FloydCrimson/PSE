import { fork, ChildProcess } from 'child_process';
import * as path from 'path';

import * as protocolsconfig from '../protocolsconfig.json';

import { CommunicationServerService } from './global/services/communication.service';

import { CommunicationImplementationType } from './protocols/common/implementations/communication.implementation.type';

const map = Object.keys(protocolsconfig.protocols).reduce((map, protocol: keyof CommunicationImplementationType) => {
    const child = fork(path.resolve(__dirname, 'main.' + protocol + '.js'), [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
    map.set(protocol, child);
    return map;
}, new Map<keyof CommunicationImplementationType, ChildProcess>());

const communicationServerService = new CommunicationServerService<CommunicationImplementationType>(map);
communicationServerService.dispatch();
