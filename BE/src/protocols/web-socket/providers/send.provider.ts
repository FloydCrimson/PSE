import { RequestImplementation } from '../implementations/request.implementation';
import { ResponseImplementation } from '../implementations/response.implementation';

export class SendProvider {

    public static sendResponse(request: RequestImplementation, response: ResponseImplementation): void {
        console.log(`Response:   ${request.route}`);
        response.socket.send(JSON.stringify(response.output));
    }

    public static sendError(request: RequestImplementation, response: ResponseImplementation): void {
        console.error(`Error:   ${request.route}`);
        response.socket.send(JSON.stringify(response.output));
    }

}
