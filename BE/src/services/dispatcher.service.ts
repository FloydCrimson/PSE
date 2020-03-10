import { ControllerService } from './controller.service';
import { EmailService } from './email.service';
import { RepositoryService } from './repository.service';

export class DispatcherService {

    private services: Map<any, any>;

    constructor() {
        this.services = new Map<any, any>();
        this.set('ControllerService', new ControllerService(this));
        this.set('EmailService', new EmailService());
        this.set('RepositoryService', new RepositoryService());
    }

    public set<K extends keyof DispatcherServiceImplementation>(type: K, service: DispatcherServiceImplementation[K]): void {
        this.services.set(type, service);
    }

    public get<K extends keyof DispatcherServiceImplementation>(type: K): DispatcherServiceImplementation[K] {
        return this.services.get(type);
    }

}

export interface DispatcherServiceImplementation {
    ControllerService: ControllerService,
    EmailService: EmailService,
    RepositoryService: RepositoryService
}
