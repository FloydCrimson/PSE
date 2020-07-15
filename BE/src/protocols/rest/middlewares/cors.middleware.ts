import { Request, Response, NextFunction } from 'express';

import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { MethodType } from '../types/method.type';

export const CORSMiddleware: MiddlewareImplementation<{ allowedOrigin: '*' | string[]; allowedMethods: '*' | MethodType[]; allowedHeaders: '*' | string[]; }> = (params = { allowedOrigin: '*', allowedMethods: '*', allowedHeaders: '*' }) => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            if (params.allowedOrigin === '*') {
                response.setHeader('Access-Control-Allow-Origin', '*');
            } else if (params.allowedOrigin.length > 0) {
                response.setHeader('Access-Control-Allow-Origin', params.allowedOrigin.join(', '));
            }
            if (request.method.toLowerCase() === MethodType.OPTIONS) {
                if (params.allowedMethods === '*') {
                    response.setHeader('Access-Control-Allow-Methods', '*');
                } else if (params.allowedMethods.length > 0) {
                    response.setHeader('Access-Control-Allow-Methods', params.allowedMethods.map(m => m.toUpperCase()).join(', '));
                }
                if (params.allowedHeaders === '*') {
                    response.setHeader('Access-Control-Allow-Headers', '*');
                } else if (params.allowedHeaders.length > 0) {
                    response.setHeader('Access-Control-Allow-Headers', params.allowedHeaders.join(', '));
                }
            }
            next();
        };
    };
}
