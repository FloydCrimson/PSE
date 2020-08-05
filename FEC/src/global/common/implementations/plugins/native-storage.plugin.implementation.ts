export interface NativeStoragePluginImplementation {
    readonly storageSupport: 0 | 1 | 2;
    clear: (success: (success: any) => void, error?: (error: any) => void) => void;
    getBoolean: (key: string, success: (success: boolean) => void, error?: (error: any) => void) => void;
    getDouble: (key: string, success: (success: number) => void, error?: (error: any) => void) => void;
    getInt: (key: string, success: (success: number) => void, error?: (error: any) => void) => void;
    getItem: (key: string, success: (success: {}) => void, error?: (error: any) => void) => void;
    getObject: (key: string, success: (success: {}) => void, error?: (error: any) => void) => void;
    getSecretItem: (key: string, encryptConfig: { mode: 'password' | 'key' | 'none', value?: string }, success: (success: {}) => void, error?: (error: any) => void) => void;
    getString: (key: string, success: (success: string) => void, error?: (error: any) => void) => void;
    initWithSuiteName: (suiteName: string, success: (success: any) => void, error?: (error: any) => void) => void;
    keys: (success: (success: string[]) => void, error?: (error: any) => void) => void;
    putBoolean: (key: string, data: boolean, success: (success: any) => void, error?: (error: any) => void) => void;
    putDouble: (key: string, data: number, success: (success: any) => void, error?: (error: any) => void) => void;
    putInt: (key: string, data: number, success: (success: any) => void, error?: (error: any) => void) => void;
    putObject: (key: string, data: {}, success: (success: any) => void, error?: (error: any) => void) => void;
    putString: (key: string, data: string, success: (success: any) => void, error?: (error: any) => void) => void;
    remove: (key: string, success: (success: any) => void, error?: (error: any) => void) => void;
    set: (key: string, data: any, success: (success: any) => void, error?: (error: any) => void) => void;
    setItem: (key: string, data: {}, success: (success: any) => void, error?: (error: any) => void) => void;
    setSecretItem: (key: string, data: {}, encryptConfig: { mode: 'password' | 'key' | 'none', value?: string }, success: (success: any) => void, error?: (error: any) => void) => void;
}
