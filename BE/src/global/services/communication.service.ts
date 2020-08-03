import { ChildProcess } from 'child_process';

import { CommunicationServiceImplementation, CommunicationMessageImplementation } from '../common/implementations/communication.implementation';

export class CommunicationServerService {

    constructor(
        private readonly map: Map<string, ChildProcess>
    ) { }

    public dispatch(): void {
        this.map.forEach((child) => {
            child.on('message', (message: CommunicationMessageImplementation) => {
                if (message.answered) {
                    if (this.map.has(message.sender)) {
                        const child = this.map.get(message.sender);
                        const sent = child.send(message);
                        if (!sent) {
                            console.warn('message not sent to sender', message);
                        }
                    } else {
                        console.warn('sender not found', message);
                    }
                } else {
                    if (this.map.has(message.receiver)) {
                        const child = this.map.get(message.receiver);
                        const sent = child.send(message);
                        if (!sent) {
                            console.warn('message not sent to receiver', message);
                        }
                    } else {
                        console.warn('receiver not found', message);
                    }
                }
            });
        });
    }

}

export class CommunicationClientService {

    private map: Map<string, [Function, Function]>;

    constructor(
        private readonly communicationService: any, // CommunicationServiceImplementation,
        private readonly sender: string
    ) {
        this.map = new Map<string, [Function, Function]>();
    }

    public receive(): void {
        process.on('message', (message: CommunicationMessageImplementation) => {
            if (message.sender === this.sender) {
                if (message.answered) {
                    if (this.map.has(message.id)) {
                        const [resolve, reject] = this.map.get(message.id);
                        resolve(message.value);
                        this.map.delete(message.id);
                    } else {
                        console.warn('id not found', message);
                    }
                } else {
                    console.warn('received unanswered message', message);
                }
            } else if (message.receiver === this.sender) {
                if (message.name in this.communicationService) {
                    this.communicationService[message.name](message.value).then((value) => {
                        if (process.send) {
                            process.send({ ...message, value, answered: true });
                        } else {
                            console.warn('process.send is undefined', message);
                        }
                    }, (error) => {
                        if (this.map.has(message.id)) {
                            const [resolve, reject] = this.map.get(message.id);
                            reject(error);
                            this.map.delete(message.id);
                        } else {
                            console.warn('id not found', message);
                        }
                    }).catch((error) => {
                        if (this.map.has(message.id)) {
                            const [resolve, reject] = this.map.get(message.id);
                            reject(error);
                            this.map.delete(message.id);
                        } else {
                            console.warn('id not found', message);
                        }
                    });
                } else {
                    console.warn('method not found', message);
                }
            } else {
                console.warn('wrong sender or receiver', message);
            }
        });
    }

    public send(message: { receiver: string; name: string; value: any; } | CommunicationMessageImplementation): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const id = Date.now().toString();
            this.map.set(id, [resolve, reject]);
            if (process.send) {
                process.send({ ...message, sender: this.sender, id, answered: false });
            } else {
                console.warn('process.send is undefined', message);
            }
        });
    }

}
