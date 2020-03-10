export interface StorageFactoryTypes {
    PersOutData: StorageFactoryTypePersOutData;
    TempOutData: StorageFactoryTypesTempOutData;
    TempInData: StorageFactoryTypesTempInData;
}

export interface StorageFactoryTypePersOutData {
    credentials: { crypted: string; auth: boolean; };
}

export interface StorageFactoryTypesTempOutData {
    initialized: boolean;
    logged: boolean;
}

export interface StorageFactoryTypesTempInData {

}
