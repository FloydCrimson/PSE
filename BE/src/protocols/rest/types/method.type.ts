import { DispatcherService } from '../services/dispatcher.service';

export type MethodPluginType<M = any> = M extends infer C ? { new(dispatcherService: DispatcherService): C; } : unknown;
