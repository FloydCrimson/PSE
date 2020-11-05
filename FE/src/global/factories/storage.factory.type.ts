import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';

export interface StorageFactoryTypes {
    PersData: StorageFactoryImplementation<StorageFactoryTypePersOutData, Promise<any>>;
    TempOutData: StorageFactoryImplementation<StorageFactoryTypesTempOutData>;
    TempInData: StorageFactoryImplementation<StorageFactoryTypesTempInData>;
}

export interface StorageFactoryTypePersOutData {
    authenticated: boolean;
    auth: { type: 'id' | 'email' | 'nickname'; value: string; };
}

export interface StorageFactoryTypesTempOutData {
    initialized: boolean;
    logged: boolean;
}

export interface StorageFactoryTypesTempInData {
    auth: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; };
}
