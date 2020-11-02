import { Request, Response, NextFunction } from '../implementations/express.implementation';
import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';

export const SessionMiddleware: MiddlewareImplementation = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            next();
        };
    };
}
