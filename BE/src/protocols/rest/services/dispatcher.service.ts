import { FactoryExtension } from "../../common/extensions/factory.extension";
import { ControllerService } from './controller.service';
import { RepositoryService } from './repository.service';

export class DispatcherService extends FactoryExtension<DispatcherServiceImplementation> {

    constructor() {
        super();
        this.initialize();
    }

    private initialize(): void {
        super.set('ControllerService', new ControllerService(this));
        super.set('RepositoryService', new RepositoryService(this));
    }

}

export interface DispatcherServiceImplementation {
    ControllerService: ControllerService;
    RepositoryService: RepositoryService;
}
