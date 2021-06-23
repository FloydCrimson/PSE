import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { PluginService } from './plugin.service';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationImplementationType } from '../../common/implementations/communication.implementation.type';

export class DispatcherService extends FactoryExtension<DispatcherServiceImplementation> {

    constructor() {
        super();
    }

}

export interface DispatcherServiceImplementation {
    PluginService: PluginService;
    CommunicationClientService: CommunicationClientService<CommunicationImplementationType, 'rest'>;
}
