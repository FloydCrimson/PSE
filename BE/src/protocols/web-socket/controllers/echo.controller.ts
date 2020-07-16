import { ControllerExtension } from '../extensions/controller.extension';
import { EchoRoute } from '../routes/echo.route';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from '../implementations/request.implementation';
import { ResponseImplementation } from '../implementations/response.implementation';
import { SendProvider } from '../providers/send.provider';

export class EchoController extends ControllerExtension {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async echo(request: RequestImplementation, response: ResponseImplementation): Promise<void> {
        let { input, output } = super.getArguments(EchoRoute.Echo, request, response);
        output = Object.keys(input).length > 0 ? input : { echo: 'Hello World!' };
        response.output = output;
        SendProvider.sendResponse(request, response);
    }

}
