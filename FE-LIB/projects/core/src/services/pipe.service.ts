import { Injectable } from "@angular/core";

@Injectable()
export class PSEPipeService {

    private readonly actions = new Array<[(...args: any[]) => Promise<any>, any[]]>();

    constructor() { }

    public async push<F extends (...args: any[]) => Promise<any>>(func: F, ...args: Parameters<F>): Promise<void> {
        this.actions.push([func, args]);
        if (this.actions.length === 1) {
            while (this.actions.length > 0) {
                const [func, args] = this.actions[0];
                await func(...args).catch();
                this.actions.splice(0, 1);
            }
        }
    }

    //

    public static create(): PSEPipeService {
        return new PSEPipeService();
    }

}
