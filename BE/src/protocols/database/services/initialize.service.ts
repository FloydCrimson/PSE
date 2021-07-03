import 'reflect-metadata';

import { getConnectionOptions, createConnection } from 'typeorm';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { CommunicationClientService } from '../../../global/services/communication.service';
import { ProtocolConfigurationsType } from '../../../global/common/types/protocol-options.type';
import { CommunicationImplementationType } from '../../common/implementations/communication.implementation.type';
import { DispatcherService } from './dispatcher.service';
import { RepositoryService } from './repository.service';
import { CommunicationService } from './communication.service';

export class InitializeService implements InitializeImplementation {

    private readonly dispatcherService = new DispatcherService();

    constructor() { }

    public async initialize(configurations: ProtocolConfigurationsType[]): Promise<boolean> {
        const result = await new Promise<boolean>((resolve) => {
            getConnectionOptions().then((connectionOptions) => createConnection(connectionOptions)).then((connection) => {
                console.log(`Express Database server has started.`);
                resolve(true);
            }).catch((error) => {
                console.error('Express Database server has not started.', error);
                resolve(false);
            });
        });
        if (result) {
            this.dispatcherService.set('RepositoryService', new RepositoryService(this.dispatcherService));
            this.dispatcherService.set('CommunicationClientService', new CommunicationClientService<CommunicationImplementationType, 'database'>(new CommunicationService(this.dispatcherService.get('RepositoryService')), 'database'));
            this.dispatcherService.get('CommunicationClientService').receive();
        }
        return result;
    }

}
