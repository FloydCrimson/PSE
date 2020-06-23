export interface RequestImplementation<B, P> {
    input: {
        body: B;
        params: P;
    };
    options: {
        cached: boolean;
        wait: boolean;
    };
}
