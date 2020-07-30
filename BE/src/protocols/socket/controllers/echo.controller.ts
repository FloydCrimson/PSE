import { ControllerExtension } from '../extensions/controller.extension';
import { EchoRoute } from '../routes/echo.route';
import { DispatcherService } from '../../../global/services/dispatcher.service';
import { RequestImplementation } from '../implementations/request.implementation';
import { MessageImplementation } from '../implementations/message.implementation';
import { SendProvider } from '../providers/send.provider';

export class EchoController extends ControllerExtension {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async echo(request: RequestImplementation): Promise<void> {
        let input = super.getArguments(EchoRoute.EchoRECEIVE, request).params;
        let output = super.getArguments(EchoRoute.EchoSEND).params;
        output = Object.keys(input).length > 0 ? input : { echo: 'Hello World!' };
        SendProvider.sendMessage(request, { operation: EchoRoute.EchoSEND.operation, params: output } as MessageImplementation);
    }

}
