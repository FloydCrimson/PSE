import { Request, Response } from 'express';
import * as hawk from '@hapi/hawk';

export class SendProvider {

    public static sendResponse(request: Request, response: Response, statusCode: number = 200, data: any = {}): Response {
        console.log(`Response:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
        if (response.locals.hawk) {
            const { artifacts, credentials } = response.locals.hawk;
            response.setHeader('Access-Control-Expose-Headers', 'Server-Authorization');
            response.setHeader('Server-Authorization', hawk.server.header(credentials, artifacts, { payload: JSON.stringify(data), contentType: 'application/json' }));
        }
        response.status(statusCode);
        return response.send(data);
    }

    public static sendError(request: Request, response: Response, statusCode: number = 500, data: any = {}): Response {
        console.error(`Error:   ${request.method} ${request.protocol} ${request.hostname} ${request.url}`);
        if (typeof data !== 'object') {
            data = { statusCode, error: data, message: data };
        }
        response.status(statusCode);
        return response.send(data);
    }

}
