import { Request, Response, NextFunction } from '../implementations/express.implementation';
import { MiddlewareImplementation } from '../implementations/middleware.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { CoderProvider } from '../../../global/providers/coder.provider';
import { SendProvider } from '../providers/send.provider';

export const ParamsMiddleware: MiddlewareImplementation = () => {
    return (dispatcherService: DispatcherService) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            try {
                request.url = request.path;
                if (!request.body) {
                    request.body = {};
                }
                if (request.query) {
                    request.query.params = request.query.params ? JSON.parse(CoderProvider.decode(request.query.params as any)) : {};
                } else {
                    request.query = { params: {} };
                }
                next();
            } catch (error) {
                SendProvider.sendError(request, response, 500, error);
            }
        };
    };
}
