import { Request } from 'express';

import { RouteImplementation } from '../implementations/route.implementation';

export class ControllerExtension<T> {

    protected getArguments<K extends keyof T, B, P, O>(type: K, route: RouteImplementation<B, P, O>, request: Request): { body: B; params: P; output: O } {
        return { body: request.body, params: request.query.params, output: undefined };
    }

    protected checkArgumentValidity(obj: { [name: string]: any }, mask: { [name: string]: MaskType }): void {
        const mandatory: string[] = [];
        const mismatch: string[] = [];
        for (const key in mask) {
            const v = obj[key];
            const t = mask[key];
            if (v === undefined || v === null) {
                if (t[t.length - 1] !== '?') {
                    mandatory.push(key);
                }
            } else if (t.indexOf(typeof v) !== 0) {
                mismatch.push(key);
            }
        }
        if (mandatory.length > 0 || mismatch.length > 0) {
            throw `Bad arguments.` + (mandatory.length > 0 ? ` Mandatory fields not found: ${mandatory.join(', ')}.` : ``) + (mismatch.length > 0 ? ` Mismatch type in fields found: ${mismatch.join(', ')}.` : ``);
        }
    }

}

export type MaskType = 'string' | 'number' | 'bigint' | 'boolean' | 'object' | 'function' | 'string?' | 'number?' | 'bigint?' | 'boolean?' | 'object?' | 'function?';
