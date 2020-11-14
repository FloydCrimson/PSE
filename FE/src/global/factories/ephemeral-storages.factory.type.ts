export interface EphemeralStorageFactoryTypes {
    Out: EphemeralStorageFactoryTypeOut;
    In: EphemeralStorageFactoryTypeIn;
}

//

export interface EphemeralStorageFactoryTypeOut {
    initialized: boolean;
    logged: boolean;
}

export interface EphemeralStorageFactoryTypeIn {
    auth: { type: 'id' | 'email' | 'nickname'; value: string; key: string; algorithm: 'sha256' | 'sha1'; };
}
