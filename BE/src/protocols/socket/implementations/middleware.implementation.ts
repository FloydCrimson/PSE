import { NextFunction } from 'express';

import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from './request.implementation';
import { ResponseImplementation } from './response.implementation';

export type MiddlewareImplementation<T> = (params?: T) => (dispatcherService: DispatcherService) => (request: RequestImplementation, response: ResponseImplementation, next: NextFunction) => Promise<any>;
