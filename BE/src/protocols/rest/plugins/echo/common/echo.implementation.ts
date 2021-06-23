import { Request } from '@hapi/hapi';

export interface EchoMethodImplementation {
    Log(request: Request, tags: string | string[], data?: string | object | (() => string | object)): void;
}
