export interface EndpointRestImplementation<B = undefined, P = undefined, O = undefined> {
    auth: boolean;
    timeout: number;
    method: 'GET' | 'POST';
    url: string;
}
