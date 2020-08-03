export type DispatcherMessageImplementation = { sender: string; receiver: string; id: string; name: string; value: any; answered: boolean; };

export type DispatcherMethodImplementation<I, O> = (params: I) => Promise<O>;

export interface DispatcherServiceImplementation {
    [name: string]: DispatcherMethodImplementation<any, any>;
}
