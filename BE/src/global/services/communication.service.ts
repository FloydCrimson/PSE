import { ChildProcess } from 'child_process';

import { CommunicationMessageImplementation, CommunicationErrorImplementation, CommunicationMethodImplementation } from '../common/implementations/communication.implementation';

export class CommunicationServerService {

    constructor(
        private readonly children: Map<string, ChildProcess>
    ) { }

    public dispatch(): void {
        this.children.forEach((child) => {
            child.on('message', (message: CommunicationMessageImplementation) => {
                if (message.answered) {
                    const sender = this.children.get(message.sender);
                    sender.send(message);
                } else {
                    if (this.children.has(message.receiver)) {
                        const receiver = this.children.get(message.receiver);
                        receiver.send(message);
                    } else {
                        const sender = this.children.get(message.sender);
                        sender.send({ ...message, value: { type: 'NO_RECEIVER' } as CommunicationErrorImplementation, answered: false, error: true });
                    }
                }
            });
        });
    }

}

export class CommunicationClientService {

    private requests: Map<number, [Function, Function, NodeJS.Timer]>;
    private id: number;

    constructor(
        private readonly communicationService: any,
        private readonly sender: string
    ) {
        this.requests = new Map<number, [Function, Function, NodeJS.Timer]>();
        this.id = 0;
    }

    public receive(): void {
        process.on('message', (message: CommunicationMessageImplementation) => {
            if (message.sender === this.sender) {
                if (this.requests.has(message.id)) {
                    const [resolve, reject, timer] = this.requests.get(message.id);
                    message.error ? reject(message.value) : resolve(message.value);
                    timer && clearTimeout(timer);
                    this.requests.delete(message.id);
                }
            } else if (message.receiver === this.sender) {
                if (message.name in this.communicationService) {
                    (this.communicationService[message.name] as CommunicationMethodImplementation<any, any>)(message.value).then((result) => {
                        process.send({ ...message, value: result, answered: true, error: false });
                    }, (error) => {
                        process.send({ ...message, value: { type: 'REJECT', error } as CommunicationErrorImplementation, answered: true, error: true });
                    }).catch((error) => {
                        process.send({ ...message, value: { type: 'CATCH', error } as CommunicationErrorImplementation, answered: true, error: true });
                    });
                } else {
                    process.send({ ...message, value: { type: 'NO_METHOD' } as CommunicationErrorImplementation, answered: true, error: true });
                }
            }
        });
    }

    public send(message: { receiver: string; name: string; value: any; }, timeout?: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const id = this.id++;
            const timer = timeout ? setTimeout((id: number) => {
                if (this.requests.has(id)) {
                    const [resolve, reject, timer] = this.requests.get(id);
                    reject({ type: 'TIMEOUT' } as CommunicationErrorImplementation);
                    this.requests.delete(id);
                }
            }, timeout, id) : undefined;
            this.requests.set(id, [resolve, reject, timer]);
            process.send({ ...message, sender: this.sender, id, answered: false, error: false });
        });
    }

}
