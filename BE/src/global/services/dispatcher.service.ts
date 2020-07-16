import { FactoryExtension } from '../common/extensions/factory.extension';
import { ControllerService as ControllerRestService } from '../../protocols/rest/services/controller.service';
import { ControllerService as ControllerWebSocketService } from '../../protocols/web-socket/services/controller.service';
import { EmailService } from './email.service';
import { RepositoryService } from '../../protocols/database/services/repository.service';

export class DispatcherService extends FactoryExtension<DispatcherServiceImplementation> {

    constructor() {
        super();
        this.initialize();
    }

    private initialize(): void {
        super.set('EmailService', new EmailService(this));
    }

}

export interface DispatcherServiceImplementation {
    ControllerRestService: ControllerRestService;
    ControllerWebSocketService: ControllerWebSocketService;
    EmailService: EmailService;
    RepositoryService: RepositoryService;
}
