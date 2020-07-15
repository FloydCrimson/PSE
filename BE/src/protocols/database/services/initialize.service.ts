import 'reflect-metadata';

import { getConnectionOptions, createConnection } from 'typeorm';

import { InitializeImplementation } from '../../../global/common/implementations/initialize.implementation';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RepositoryService } from './repository.service';
// import { RoleType } from '../types/role.type';
// import * as EI from '../entities.index';

export class InitializeService implements InitializeImplementation {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public initialize(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // SERVER
            getConnectionOptions().then((connectionOptions) => createConnection(connectionOptions)).then((connection) => {
                console.log(`Express Database server has started.`);
                // const authEntity = new EI.AuthEntity();
                // authEntity.id = 'dh37fgj492je';
                // authEntity.email = 'pippo@ciaone.com';
                // authEntity.nickname = 'Pippo';
                // authEntity.key = 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn';
                // authEntity.algorithm = 'sha256';
                // authEntity.role = RoleType.USER;
                // const authEntityRepository = connection.getRepository(EI.AuthEntity);
                // authEntityRepository.save(authEntity);
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
                this.dispatcherService.set('RepositoryService', new RepositoryService(this.dispatcherService));
            }
            return result;
        });
    }

}
