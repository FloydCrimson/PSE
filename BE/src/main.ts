import { fork, ChildProcess } from 'child_process';
import * as path from 'path';

import * as protocolsconfig from '../protocolsconfig.json';

import { CommunicationServerService } from './global/services/communication.service';

import { CommunicationServiceImplementation } from './protocols/common/implementations/communication-service.implementation';

const map = Object.keys(protocolsconfig.protocols).reduce((map, protocol: keyof CommunicationServiceImplementation) => {
    const child = fork(path.resolve(__dirname, 'main.' + protocol + '.js'), [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
    map.set(protocol, child);
    return map;
}, new Map<keyof CommunicationServiceImplementation, ChildProcess>());

const communicationServerService = new CommunicationServerService<CommunicationServiceImplementation>(map);
communicationServerService.dispatch();
