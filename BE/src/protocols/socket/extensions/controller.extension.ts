import { RouteImplementation } from '../implementations/route.implementation';
import { RequestImplementation } from '../implementations/request.implementation';

export class ControllerExtension {

    protected getArguments<P>(route: RouteImplementation<P>, request?: RequestImplementation): { params: P; } {
        return { params: request ? request.message.params : undefined };
    }

    protected checkArgumentValidity(obj: any, mask: MaskType | MaskObject | MaskArray): CheckArgumentValidityResponse {
        if (obj === undefined || obj === null) {
            // TODO: check if mandatory?
        } else if (obj.constructor === Array) { // MaskArray
            if (mask.constructor === Array) {
                let rt: CheckArgumentValidityResponse = null;
                for (const o of (obj as Array<any>)) {
                    let rp: CheckArgumentValidityResponse = { obj: o, mask };
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
                const rt: CheckArgumentValidityResponse = { obj, mask };
                return rt;
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
                const rt: CheckArgumentValidityResponse = { obj, mask };
                return rt;
            }
        } else { // MaskType
            if (typeof obj !== (mask as MaskType)) {
                const rt: CheckArgumentValidityResponse = { obj, mask };
                return rt;
            }
        }
        return null;
    }

}

type MaskType = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';
type MaskObject = { [name: string]: MaskType | MaskObject | MaskArray };
type MaskArray = Array<MaskType | MaskObject>;

type CheckArgumentValidityResponse = { obj: any; mask: MaskType | MaskObject | MaskArray; };
