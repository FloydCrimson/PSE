export interface EndpointRestImplementation<B = undefined, P = undefined, O = undefined> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    options?: {
        auth?: 'full' | 'partial';
        crypted?: boolean;
        timeout?: number;
    };
}
