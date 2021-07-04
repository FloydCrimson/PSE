import { DispatcherService } from './dispatcher.service';

export class CommunicationService {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

}
