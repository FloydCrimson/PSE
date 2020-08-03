import { fork, ChildProcess } from 'child_process';
import * as path from 'path';

import { DispatcherServerService } from './global/services/dispatcher.service';

const map: Map<string, ChildProcess> = new Map<string, ChildProcess>();
['database', 'rest', 'socket'].forEach((configuration) => {
    const child = fork(path.resolve(__dirname, 'main.' + configuration + '.js'), [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
    map.set(configuration, child);
});

const dispatcherServerService = new DispatcherServerService(map);
dispatcherServerService.dispatch();
