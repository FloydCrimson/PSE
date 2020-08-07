export type CommunicationMessageImplementation = { sender: string; receiver: string; id: number; name: string; value: any; answered: boolean; error: boolean; };
export type CommunicationErrorImplementation = { type: 'REJECT' | 'CATCH' | 'NO_RECEIVER' | 'NO_METHOD' | 'TIMEOUT'; error?: any; };

export type CommunicationMethodImplementation<I, O> = (params: I) => Promise<O>;
