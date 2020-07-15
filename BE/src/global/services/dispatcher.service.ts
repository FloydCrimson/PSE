import { FactoryExtension } from '../common/extensions/factory.extension';
import { ControllerService } from '../../protocols/rest/services/controller.service';
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
    ControllerService: ControllerService;
    EmailService: EmailService;
    RepositoryService: RepositoryService;
}
