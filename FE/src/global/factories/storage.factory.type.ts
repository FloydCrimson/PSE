export interface StorageFactoryTypes {
    PersOutData: StorageFactoryTypePersOutData;
    TempOutData: StorageFactoryTypesTempOutData;
    TempInData: StorageFactoryTypesTempInData;
}

export interface StorageFactoryTypePersOutData {
    activated: boolean;
}

export interface StorageFactoryTypesTempOutData {
    initialized: boolean;
    logged: boolean;
}

export interface StorageFactoryTypesTempInData {
    auth: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; };
}
