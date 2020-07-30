import { NextFunction } from 'express';

import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from './request.implementation';

export type MiddlewareImplementation<T> = (params?: T) => (dispatcherService: DispatcherService) => (request: RequestImplementation, next: NextFunction) => Promise<any>;
