import * as protocolsconfig from '../protocolsconfig.json';

import { InitializeImplementation } from './global/common/implementations/initialize.implementation';
import { InitializeService } from './protocols/rest/services/initialize.service';

const service: InitializeImplementation = new InitializeService();
service.initialize(protocolsconfig.protocols['rest']);
