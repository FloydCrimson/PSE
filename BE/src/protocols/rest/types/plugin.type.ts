import { RouteType } from './route.type';
import { ControllerPluginType } from './controller.type';
import { ExtensionPluginType } from './extension.type';
import { MethodPluginType } from './method.type';

export type PluginVersionType<P, M = any> = { route: RouteType<P>; controller?: ControllerPluginType<P, M>; extension?: ExtensionPluginType<P, M>; };
export type PluginCommonType<M = any> = { method?: MethodPluginType<M>; };
export type PluginConfigType = { name: string; routes: { [route: string]: { version: string; }; }; methods?: { [method: string]: {}; }; };
export type PluginIndex<P, M = any> = { config: () => Promise<PluginConfigType>; version: { [version: string]: () => Promise<PluginVersionType<P, M>>; }; common: { method?: () => Promise<MethodPluginType<M>>; } };
