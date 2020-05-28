import { Request } from 'express';

import { RouteImplementation } from '../implementations/route.implementation';

export class ControllerExtension<T> {

    protected getArguments<K extends keyof T, B, P, O>(type: K, route: RouteImplementation<B, P, O>, request: Request): { body: B; params: P; output: O } {
        return { body: request.body, params: request.query.params, output: undefined };
    }

    protected checkArgumentValidity(obj: any, mask: MaskType | MaskObject | MaskArray): { obj: any, mask: MaskType | MaskObject | MaskArray } {
        if (obj === undefined || obj === null) {
            // TODO: check if mandatory
        } else if (obj.constructor === Array) { // MaskArray
            if (mask.constructor === Array) {
                let rt = null;
                for (const o of (obj as Array<any>)) {
                    let rp = { obj: o, mask };
                    for (const m of (mask as MaskArray)) {
                        rp = rp ? this.checkArgumentValidity(o, m) : rp;
                        if (!rp) {
                            break;
                        }
                    }
                    rt = rt ? rt : rp;
                    if (rt) {
                        break;
                    }
                }
                if (rt) {
                    return rt;
                }
            } else {
                return { obj, mask };
            }
        } else if (obj.constructor === Object) { // MaskObject
            if (mask.constructor === Object) {
                for (const mn in (mask as MaskObject)) {
                    const rt = this.checkArgumentValidity(obj[mn], mask[mn]);
                    if (rt) {
                        return rt;
                    }
                }
            } else {
                return { obj, mask };
            }
        } else { // MaskType
            if (typeof obj !== (mask as MaskType)) {
                return { obj, mask };
            }
        }
        return null;
    }

}

export type MaskType = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';
export type MaskObject = { [name: string]: MaskType | MaskObject | MaskArray };
export type MaskArray = Array<MaskType | MaskObject>;
