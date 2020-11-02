import { Request, Response, NextFunction } from './express.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export type MiddlewareImplementation<T = undefined> = (params?: Partial<T>) => (dispatcherService: DispatcherService) => (request: Request, response: Response, next: NextFunction) => Promise<void>;
