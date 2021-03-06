import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { CommunicationServiceImplementation } from '../../common/implementations/communication-service.implementation';
import { ControllerService } from './controller.service';

export class DispatcherService extends FactoryExtension<DispatcherServiceImplementation> {

    constructor() {
        super();
    }

}

export interface DispatcherServiceImplementation {
    ControllerService: ControllerService;
    CommunicationClientService: CommunicationClientService<CommunicationServiceImplementation, 'socket'>;
}
