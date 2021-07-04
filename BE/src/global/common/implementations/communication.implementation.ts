export type CommunicationMessageImplementation<C, S extends keyof C, R extends keyof C, N extends keyof C[R]> = {
    sender: S;
    receiver: R;
    id: number;
    name: N;
    params: C[R][N] extends (...args: infer P) => Promise<any> ? P : never;
    output: C[R][N] extends (...args: any) => Promise<infer O> ? Promise<O> : never;
    error: CommunicationErrorImplementation;
    answered: boolean;
};

export type CommunicationErrorImplementation = {
    type: 'REJECT' | 'CATCH' | 'NO_RECEIVER' | 'NO_METHOD' | 'TIMEOUT';
    error?: any;
};
