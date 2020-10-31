import { Request, Response } from 'express';

import { CustomError, CustomErrorProvider } from '../../common/providers/error.provider';

import { RouteImplementation } from '../implementations/route.implementation';

export class ControllerMethodWrapperProvider {

    public static async wrap<B, P, O>(route: RouteImplementation<B, P, O>, request: Request, response: Response, callback: (body: B, params: P, output: O) => Promise<O>): Promise<O> {
        let result: O;
        try {
            const { body, params, output } = { body: request ? (request.body as any) : undefined, params: request ? (request.query.params as any) : undefined, output: undefined };
            if (route.maskB && ControllerMethodWrapperProvider.checkArgumentValidity(body, route.maskB)) {
                throw CustomErrorProvider.getError('Rest', 'GENERIC', 'REQUEST_MALFORMED');
            }
            if (route.maskP && ControllerMethodWrapperProvider.checkArgumentValidity(params, route.maskP)) {
                throw CustomErrorProvider.getError('Rest', 'GENERIC', 'REQUEST_MALFORMED');
            }
            result = await callback(body, params, output);
            if (route.maskO && ControllerMethodWrapperProvider.checkArgumentValidity(result, route.maskO)) {
                throw CustomErrorProvider.getError('Rest', 'GENERIC', 'RESPONSE_MALFORMED');
            }
        } catch (error) {
            throw (error.constructor === CustomError) ? error : CustomErrorProvider.getError('Rest', 'GENERIC', 'UNCAUGHT');
        }
        return result;
    }

    private static checkArgumentValidity(obj: any, mask: Masks): CheckArgumentValidityResponse {
        if (obj === undefined || obj === null) {
            // TODO: check if mandatory?
        } else if (obj.constructor === Array) { // MaskArray
            if (mask.constructor === Array) {
                let rt: CheckArgumentValidityResponse = null;
                for (const o of (obj as Array<any>)) {
                    let rp: CheckArgumentValidityResponse = { obj: o, mask };
                    for (const m of (mask as MaskArray)) {
                        rp = rp ? ControllerMethodWrapperProvider.checkArgumentValidity(o, m) : rp;
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
                    const rt = ControllerMethodWrapperProvider.checkArgumentValidity(obj[mn], mask[mn]);
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
