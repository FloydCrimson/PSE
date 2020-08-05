export interface MessageSocketImplementation<P> {
    auth?: string;
    operation: string;
    params: P;
}
