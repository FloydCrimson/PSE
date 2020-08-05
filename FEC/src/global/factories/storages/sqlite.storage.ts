import { StorageFactoryImplementation } from 'global/common/implementations/factories/storage.factory.implementation';
import { SQLitePluginImplementation, IDatabase, IResponse } from 'global/common/implementations/plugins/sqlite.plugin.implementation';
import { LoggingService } from 'global/services/logging.service';

export class SQLiteStorage<T> implements StorageFactoryImplementation<T> {

    private storage: IDatabase;

    constructor(
        private readonly sqLitePlugin: SQLitePluginImplementation,
        private readonly loggingService: LoggingService
    ) { }

    public ready(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage = this.sqLitePlugin.openDatabase({ name: 'SQLiteStorage.db', location: 'default' });
            const queries: { query: string, values?: any[] }[] = [];
            queries.push(...this.readyQueries());
            this.executeQueries(queries).then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public set<K extends keyof T>(key: K, data: T[K]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const queries: { query: string, values?: any[] }[] = [];
            queries.push(...this.removeQueries(key.toString(), ''));
            queries.push(...this.setQueries(key.toString(), data, ''));
            this.executeQueries(queries).then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public get<K extends keyof T>(key: K): Promise<T[K]> {
        return new Promise<T[K]>((resolve, reject) => {
            const queries: { query: string, values?: any[] }[] = [];
            queries.push(...this.getQueries(key.toString(), ''));
            this.executeQueries(queries).then((resolved) => {
                let result = {};
                for (const response of resolved) {
                    for (let index = 0; index < response.rows.length; index++) {
                        const { name, value, type, path } = response.rows.item(index);
                        let casted;
                        switch (type) {
                            case 'Undefined':
                                casted = undefined;
                                break;
                            case 'Null':
                                casted = null;
                                break;
                            case 'Object':
                                casted = {};
                                break;
                            case 'Array':
                                casted = [];
                                break;
                            case 'String':
                                casted = value.toString();
                                break;
                            case 'Number':
                                casted = Number(value);
                                break;
                            case 'Symbol':
                                casted = Symbol(value);
                                break;
                            case 'Boolean':
                                casted = value === 'true';
                                break;
                            default:
                                this.loggingService.LOG('WARN', { class: SQLiteStorage.name, function: this.get.name, text: 'Unrecognizable type found' }, type);
                                break;
                        }
                        path.split('/').slice(0, -1).reduce((r, n, i, a) => r[n] = (n in r) ? r[n] : (a.length === i + 1 ? casted : {}), result);
                    }
                }
                resolve(result[Object.keys(result)[0]]);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public remove<K extends keyof T>(key: K): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const queries: { query: string, values?: any[] }[] = [];
            queries.push(...this.removeQueries(key.toString(), ''));
            this.executeQueries(queries).then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    public clear(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const queries: { query: string, values?: any[] }[] = [];
            queries.push(...this.clearQueries());
            this.executeQueries(queries).then((resolved) => {
                resolve(true);
            }, (rejected) => {
                reject(rejected);
            }).catch((caught) => {
                reject(caught);
            });
        });
    }

    //

    private readyQueries(): { query: string, values?: any[] }[] {
        const queries: { query: string, values?: any[] }[] = [];
        queries.push({ query: 'CREATE TABLE IF NOT EXISTS storage (name TEXT, value TEXT, type TEXT, path TEXT PRIMARY KEY)' });
        return queries;
    }

    private setQueries(name: string, value: any, path: string): { query: string, values?: any[] }[] {
        const queries: { query: string, values?: any[] }[] = [];
        if (name.indexOf('/') >= 0) {
            this.loggingService.LOG('ERROR', { class: SQLiteStorage.name, function: this.setQueries.name, text: 'Incompatible name found' }, name);
            return queries;
        }
        if (value === undefined) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, null, 'Undefined', path + name + '/'] });
        } else if (value === null) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, null, 'Null', path + name + '/'] });
        } else if (value.constructor === Object) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, null, 'Object', path + name + '/'] });
            for (const key in value) {
                queries.push(...this.setQueries(key, value[key], path + name + '/'));
            }
        } else if (value.constructor === Array) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, null, 'Array', path + name + '/'] });
            for (const key in value) {
                queries.push(...this.setQueries(key, value[key], path + name + '/'));
            }
        } else if (value.constructor === String) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, value.toString(), 'String', path + name + '/'] });
        } else if (value.constructor === Number) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, value.toString(), 'Number', path + name + '/'] });
        } else if (value.constructor === Symbol) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, value.toString(), 'Symbol', path + name + '/'] });
        } else if (value.constructor === Boolean) {
            queries.push({ query: 'INSERT INTO storage (name, value, type, path) VALUES (?,?,?,?)', values: [name, value.toString(), 'Boolean', path + name + '/'] });
        } else {
            this.loggingService.LOG('WARN', { class: SQLiteStorage.name, function: this.setQueries.name, text: 'Unrecognizable value found' }, value);
        }
        return queries;
    }

    private getQueries(name: string, path: string): { query: string, values?: any[] }[] {
        const queries: { query: string, values?: any[] }[] = [];
        queries.push({ query: 'SELECT * FROM storage WHERE SUBSTR(path, 0, LENGTH(\'' + (path + name + '/') + '\') + 1) = \'' + (path + name + '/') + '\'' });
        return queries;
    }

    private removeQueries(name: string, path: string): { query: string, values?: any[] }[] {
        const queries: { query: string, values?: any[] }[] = [];
        queries.push({ query: 'DELETE FROM storage WHERE SUBSTR(path, 0, LENGTH(\'' + (path + name + '/') + '\') + 1) = \'' + (path + name + '/') + '\'' });
        return queries;
    }

    private clearQueries(): { query: string, values?: any[] }[] {
        const queries: { query: string, values?: any[] }[] = [];
        queries.push({ query: 'DELETE FROM storage' });
        return queries;
    }

    private executeQueries(queries: { query: string, values?: any[] }[]): Promise<IResponse[]> {
        const promises = queries.map(query => new Promise<IResponse>((resolve, reject) => {
            this.storage.executeSql(query.query, query.values, (success) => resolve(success), (error) => reject(error));
        }));
        return Promise.all(promises);
    }

}
