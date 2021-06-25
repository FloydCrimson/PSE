import { Request } from '@hapi/hapi';

export interface HawkMethodImplementation {
    credentialsFunc(encoded: string): Promise<any>;
    requestMapper(request: Request): any;
}
