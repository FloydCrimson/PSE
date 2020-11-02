import { Request, Response, NextFunction } from '../implementations/express.implementation';
import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export const LogMiddleware: MiddlewareImplementation<{ verbose: boolean; }> = (params) => {
    params = { verbose: false, ...params };
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            console.log(`Request:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
            next();
        };
    };
}
