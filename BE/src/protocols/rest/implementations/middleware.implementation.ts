import { Request, Response, NextFunction } from 'express';

import { DispatcherService } from '../../../global/services/dispatcher.service';

export type MiddlewareImplementation<T> = (params?: T) => (dispatcherService: DispatcherService) => (request: Request, response: Response, next: NextFunction) => Promise<any>;
