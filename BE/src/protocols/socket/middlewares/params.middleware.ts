import { NextFunction } from 'express';

import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { RequestImplementation } from '../implementations/request.implementation';
import { MessageImplementation } from '../implementations/message.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export const ParamsMiddleware: MiddlewareImplementation<undefined> = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: RequestImplementation, next: NextFunction) => {
            try {
                if (typeof request.message === 'string') { // string
                    request.message = JSON.parse(request.message) as MessageImplementation;
                } else if (request.message.constructor === Buffer.constructor) { // Buffer
                    throw 'Conversion from "Buffer" not implemented.';
                } else if (request.message.constructor === ArrayBuffer.constructor) { // ArrayBuffer
                    throw 'Conversion from "ArrayBuffer" not implemented.';
                } else { // Buffer[]
                    throw 'Conversion from "Buffer[]" not implemented.';
                }
                next();
            } catch (error) {
                console.error('ParamsMiddleware', error);
                return;
            }
        };
    };
}
