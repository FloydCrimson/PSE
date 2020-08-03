import * as protocolsconfig from '../protocolsconfig.json';

import { InitializeImplementation } from './global/common/implementations/initialize.implementation';
import { InitializeService } from './protocols/database/services/initialize.service';

const service: InitializeImplementation = new InitializeService();
service.initialize(protocolsconfig.protocols['database'] as any);
