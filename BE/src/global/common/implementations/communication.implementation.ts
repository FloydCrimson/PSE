export type CommunicationMessageImplementation = { sender: string; receiver: string; id: string; name: string; value: any; answered: boolean; error: boolean; };

export type CommunicationMethodImplementation<I, O> = (params: I) => Promise<O>;

export interface CommunicationServiceImplementation {
    [name: string]: CommunicationMethodImplementation<any, any>;
}
