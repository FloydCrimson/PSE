import { ChildProcess } from 'child_process';

import { CommunicationMessageImplementation, CommunicationErrorImplementation, CommunicationMethodImplementation } from '../common/implementations/communication.implementation';

export class CommunicationServerService<C> {

    constructor(
        private readonly children: Map<keyof C, ChildProcess>
    ) { }

    public dispatch(): void {
        this.children.forEach((child) => {
            child.on('message', (message: CommunicationMessageImplementation<C, keyof C, keyof C, any>) => {
                if (message.answered) {
                    const sender = this.children.get(message.sender);
                    sender.send(message);
                } else {
                    if (this.children.has(message.receiver)) {
                        const receiver = this.children.get(message.receiver);
                        receiver.send(message);
                    } else {
                        const sender = this.children.get(message.sender);
                        sender.send({ ...message, error: { type: 'NO_RECEIVER' }, answered: false } as CommunicationMessageImplementation<C, keyof C, keyof C, any>);
                    }
                }
            });
        });
    }

}

export class CommunicationClientService<C, S extends keyof C> {

    private requests = new Map<number, [(value?: any) => void, (reason?: CommunicationErrorImplementation) => void, NodeJS.Timer]>();
    private id = 0;

    constructor(
        private readonly communicationService: C[S],
        private readonly sender: S
    ) { }

    public receive(): void {
        process.on('message', (message: CommunicationMessageImplementation<C, S, keyof C, any>) => {
            if (message.sender === this.sender) {
                if (this.requests.has(message.id)) {
                    const [resolve, reject, timer] = this.requests.get(message.id);
                    message.error ? reject(message.error) : resolve(message.output);
                    timer && clearTimeout(timer);
                    this.requests.delete(message.id);
                }
            } else if (message.receiver === this.sender) {
                if (message.name in this.communicationService) {
                    (this.communicationService[message.name] as CommunicationMethodImplementation<(...params: any) => Promise<any>>)(...message.params).then((result) => {
                        process.send({ ...message, output: result, answered: true } as CommunicationMessageImplementation<C, S, keyof C, any>);
                    }, (error) => {
                        process.send({ ...message, error: { type: 'REJECT', value: error }, answered: true } as CommunicationMessageImplementation<C, S, keyof C, any>);
                    }).catch((error) => {
                        process.send({ ...message, error: { type: 'CATCH', value: error }, answered: true } as CommunicationMessageImplementation<C, S, keyof C, any>);
                    });
                } else {
                    process.send({ ...message, error: { type: 'NO_METHOD' }, answered: true } as CommunicationMessageImplementation<C, S, keyof C, any>);
                }
            }
        });
    }

    public send<R extends keyof C, N extends keyof C[R]>(receiver: R, name: N, ...params: C[R][N] extends (...args: infer P) => any ? P : never): C[R][N] extends (...args: any) => infer R ? R : any {
        return new Promise<any>((resolve, reject) => {
            const timeout = 30000;
            const id = this.id++;
            const timer = timeout ? setTimeout((id: number) => {
                if (this.requests.has(id)) {
                    const [resolve, reject, timer] = this.requests.get(id);
                    reject({ type: 'TIMEOUT' } as CommunicationErrorImplementation);
                    this.requests.delete(id);
                }
            }, timeout, id) : undefined;
            this.requests.set(id, [resolve, reject, timer]);
            process.send({ sender: this.sender, receiver, id, name, params: params as any, output: undefined, error: undefined, answered: false } as CommunicationMessageImplementation<C, S, R, N>);
        }) as any;
    }

}
