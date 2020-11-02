export interface EndpointRestImplementation<B = undefined, P = undefined, O = undefined> {
    auth: 'full' | 'partial' | 'none';
    timeout: number;
    method: 'GET' | 'POST';
    url: string;
}
