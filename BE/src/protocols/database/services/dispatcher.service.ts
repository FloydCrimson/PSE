import { FactoryExtension } from "../../../global/common/extensions/factory.extension";
import { RepositoryService } from "./repository.service";
import { CommunicationClientService } from "../../../global/services/communication.service";

export class DispatcherService extends FactoryExtension<DispatcherServiceImplementation> {

    constructor() {
        super();
    }

}

export interface DispatcherServiceImplementation {
    RepositoryService: RepositoryService;
    CommunicationClientService: CommunicationClientService;
}