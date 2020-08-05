export interface SQLitePluginImplementation {
    openDatabase(args: IArgs, success?: (database: IDatabase) => void, error?: (error: any) => void): IDatabase;
    deleteDatabase(args: IArgs, success?: (success: any) => void, error?: (error: any) => void): void;
    echoTest(success: (success: any) => void, error: (error: any) => void): void;
}

export interface IArgs {
    name: string;
    location: 'default';
    iosDatabaseLocation?: 'default' | 'Documents' | 'Library';
    androidDatabaseProvider?: 'default' | 'system';
}

export interface IDatabase {
    openDBs: { [name: string]: 'INIT' | 'OPEN' };
    transaction(transaction: (transaction: ITransaction) => void, error?: (error: any) => void, success?: () => void): void;
    readTransaction(transaction: (transaction: ITransaction) => void, error?: (error: any) => void, success?: () => void): void;
    executeSql(query: string, values?: any[], success?: (success: IResponse) => void, error?: (error: any) => void): void;
    sqlBatch(queries: (string | [string, any[]])[], success?: (success: IResponse) => void, error?: (error: any) => void): void;
}

export interface ITransaction {
    executeSql(query: string, values?: any[], success?: (success: IResponse) => void, error?: (error: any) => void): void;
}

export interface IResponse {
    insertId: number;
    rowsAffected: number;
    rows: {
        item(index: number): { [column: string]: any };
        length: number;
    };
}
