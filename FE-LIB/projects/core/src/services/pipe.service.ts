import { Injectable } from "@angular/core";

@Injectable()
export class PSEPipeService {

    private readonly actions = new Array<[PSEPipeFunc, PSEPipeParameters<PSEPipeFunc>, PSEPipeResolve<PSEPipeFunc>, PSEPipeReject]>();

    constructor() { }

    public push<T extends PSEPipeFunc>(func: T, ...args: PSEPipeParameters<T>): Promise<PSEPipeReturnType<T>> {
        return new Promise<PSEPipeReturnType<T>>(async (resolve, reject) => {
            this.actions.push([func, args, resolve, reject]);
            this.exhaust();
        });
    }

    private async exhaust(): Promise<void> {
        if (this.actions.length === 1) {
            while (this.actions.length > 0) {
                const [func, args, resolve, reject] = this.actions[0];
                await func(...args).then((value) => resolve(value)).catch((reason?) => reject(reason));
                this.actions.splice(0, 1);
            }
        }
    }

    //

    public static create(): PSEPipeService {
        return new PSEPipeService();
    }

}

type PSEPipeFunc = (...args: any) => Promise<any>;
type PSEPipeResolve<T extends PSEPipeFunc> = (value: PSEPipeReturnType<T> | PromiseLike<PSEPipeReturnType<T>>) => void;
type PSEPipeReject = (reason?: any) => void;
type PSEPipeParameters<T extends PSEPipeFunc> = T extends (...args: infer P) => Promise<any> ? P : never;
type PSEPipeReturnType<T extends PSEPipeFunc> = T extends (...args: any) => Promise<infer R> ? R : any;
