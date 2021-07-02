import { CoderProvider } from 'pse-global-providers';

import { DispatcherService } from '../services/dispatcher.service';
import { ValidateMethodFactoryType, ValidateOptionsType } from '../types/validate.type';
import { CheckArgumentValidityProvider, Masks } from '../providers/check-argument-validity.provider';

export type QueryMaskValidateMethodFactoryParams = { mask: Masks; };

export const QueryMaskValidateMethodFactory: ValidateMethodFactoryType<QueryMaskValidateMethodFactoryParams> = (params: QueryMaskValidateMethodFactoryParams) => (dispatcherService: DispatcherService) => async function (value: object | Buffer | string, options: ValidateOptionsType): Promise<any> {
    value = (value === null || value === undefined) ? new Object() : (Object.getPrototypeOf(value) ? value : Object.setPrototypeOf(value, Object.prototype)); // WORKAROUND: fix missing constructor in value
    value = (typeof value === 'object' && Object.keys(value).length === 1 && 'params' in value && typeof value['params'] === 'string') ? JSON.parse(CoderProvider.decode(value['params'])) : value;
    const check = CheckArgumentValidityProvider.check(value, params.mask);
    if (check) {
        throw new Error('Invalid query received. Expected:   ' + JSON.stringify(params.mask));
    }
    return value;
};
