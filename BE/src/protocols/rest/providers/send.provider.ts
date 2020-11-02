import * as hawk from '@hapi/hawk';
import { Request, Response } from '../implementations/express.implementation';

export class SendProvider {

    public static sendResponse(request: Request, response: Response, status: number = 200, data: any = {}): Response {
        console.log(`Response:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
        if (response.locals.hawk && response.locals.hawk.artifacts && response.locals.hawk.credentials) {
            const { artifacts, credentials } = response.locals.hawk;
            response.setHeader('Access-Control-Expose-Headers', 'Server-Authorization');
            response.setHeader('Server-Authorization', hawk.server.header(credentials, artifacts, { payload: JSON.stringify(data), contentType: 'application/json' }));
        }
        response.status(status);
        return response.send(data);
    }

    public static sendError(request: Request, response: Response, status: number = 500, data: any = {}): Response {
        console.error(`Error:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
        if (typeof data !== 'object') {
            data = { status, error: data, message: data };
        }
        response.status(status);
        return response.send(data);
    }

}
