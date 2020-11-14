export interface RequestRestImplementation<B, P> {
    input: {
        body: B;
        params: P;
    };
    options: {
        /** if 'true' returns, if cached, a previous response retrieved with the same request, else, or if 'false', a call is made. Default: false */
        cached: boolean;
        /** if 'true' awaits, if ongoing, a call made with the same request, else, or if 'false', a call is made. Default: true */
        wait: boolean;
    };
}
