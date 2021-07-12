export class CheckArgumentValidityProvider {

    public static check(obj: any, mask: Masks): CheckArgumentValidityResponse {
        if ((obj === undefined || obj === null) && (mask !== undefined && mask !== null)) { // MaskArray
            const rt: CheckArgumentValidityResponse = { obj, mask };
            return rt;
        } else if (obj.constructor === Array) { // MaskArray
            if (mask.constructor === Array) {
                let rt: CheckArgumentValidityResponse = null;
                for (const o of (obj as Array<any>)) {
                    let rp: CheckArgumentValidityResponse = { obj: o, mask };
                    for (const m of (mask as MaskArray)) {
                        rp = rp ? CheckArgumentValidityProvider.check(o, m) : rp;
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
                    let rt: CheckArgumentValidityResponse = null;
                    if (!(mn in obj)) {
                        rt = { obj, mask };
                    }
                    rt = rt ? rt : CheckArgumentValidityProvider.check(obj[mn], mask[mn]);
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

export type Masks = MaskType | MaskObject | MaskArray;

type MaskType = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';
type MaskObject = { [name: string]: Masks };
type MaskArray = Array<MaskType | MaskObject>;

type CheckArgumentValidityResponse = { obj: any; mask: Masks; };
