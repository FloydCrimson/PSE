export interface EndpointImplementation<B, P, O> {
    auth: boolean;
    timeout: number;
    method: 'GET' | 'POST';
    url: string;
}
