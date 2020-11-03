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

    private readonly dispatcherService: DispatcherService = new DispatcherService();

    constructor() { }

    public initialize(configurations: ProtocolConfigurationsType[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // SERVER
            getConnectionOptions().then((connectionOptions) => createConnection(connectionOptions)).then((connection) => {
                console.log(`Express Database server has started.`);
                resolve(true);
            }, (rejected) => {
                console.error('Express Database server has not started: ', rejected);
                reject(rejected);
            }).catch((caught) => {
                console.error('Express Database server has not started: ', caught);
                reject(caught);
            });
        }).then((result) => {
            // DISPATCHER
            if (result) {
                const repositoryService = new RepositoryService(this.dispatcherService);
                const communicationClientService = new CommunicationClientService<CommunicationImplementationType, 'database'>(new CommunicationService(repositoryService), 'database');
                this.dispatcherService.set('RepositoryService', repositoryService);
                this.dispatcherService.set('CommunicationClientService', communicationClientService);
                communicationClientService.receive();
            }
            return result;
        });
    }

}
