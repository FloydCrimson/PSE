import { SQLitePluginImplementation } from 'global/common/implementations/plugins/sqlite.plugin.implementation';
import { NativeStoragePluginImplementation } from 'global/common/implementations/plugins/native-storage.plugin.implementation';

export class PluginProvider {

    public static get<K extends keyof PluginProviderImplementation>(plugin: K): PluginProviderImplementation[K] {
        return plugin.split('.').reduce((o, p) => o[p], window);
    }

}

export interface PluginProviderImplementation {
    'sqlitePlugin': SQLitePluginImplementation;
    'NativeStorage': NativeStoragePluginImplementation;
}
