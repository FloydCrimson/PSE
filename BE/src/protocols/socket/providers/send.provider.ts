import { RequestImplementation } from '../implementations/request.implementation';
import { MessageImplementation } from '../implementations/message.implementation';

export class SendProvider {

    public static sendMessage(request: RequestImplementation, message: MessageImplementation): void {
        console.log(`Message:   ${request.request.method} ${message.operation}`);
        request.socket.send(JSON.stringify(message));
    }

}
