export interface PersistentStorageFactoryTypes {
    Local: PersistentStorageFactoryTypeLocal;
}

//

export interface PersistentStorageFactoryTypeLocal {
    auth: { type: 'id' | 'email' | 'nickname'; value: string; };
    authenticated: boolean;
}
