import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { StrategyService } from './strategy.service';
import { PluginService } from './plugin.service';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationServiceImplementation } from '../../common/implementations/communication-service.implementation';

export class DispatcherService extends FactoryExtension<DispatcherServiceImplementation> {

    constructor() {
        super();
    }

}

export interface DispatcherServiceImplementation {
    StrategyService: StrategyService;
    PluginService: PluginService;
    CommunicationClientService: CommunicationClientService<CommunicationServiceImplementation, 'rest'>;
}
