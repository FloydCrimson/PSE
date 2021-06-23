import { Request, ResponseToolkit } from '@hapi/hapi';

import { ControllerPluginType } from '../../../types/controller.type';
import { NotFoundRouteImplementation } from './not-found.implementation';
import { DispatcherService } from '../../../services/dispatcher.service';

export const NotFoundController: ControllerPluginType<NotFoundRouteImplementation> = {
    // /{any*}
    NotFoundANY: (dispatcherService: DispatcherService) => async function (request: Request, h: ResponseToolkit, err?: Error): Promise<any> {
        request.log('NotFoundController.NotFoundANY', err || request.url);
        return h.response(`404 Error! Page ${request.path} Not Found!`).code(404);
    }
};
