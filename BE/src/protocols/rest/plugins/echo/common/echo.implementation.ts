import * as Hapi from '@hapi/hapi';

export interface EchoMethodImplementation {
    Log(request: Hapi.Request, tags: string | string[], data?: string | object | (() => string | object)): void;
}
