import { DispatcherService } from '../services/dispatcher.service';
import { ValidateMethodFactoryType, ValidateOptionsType } from '../types/validate.type';
import { CheckArgumentValidityProvider, Masks } from '../providers/check-argument-validity.provider';

export type OutputMaskValidateMethodFactoryParams = { mask: Masks; };

export const OutputMaskValidateMethodFactory: ValidateMethodFactoryType<OutputMaskValidateMethodFactoryParams> = (params: OutputMaskValidateMethodFactoryParams) => (dispatcherService: DispatcherService) => async function (value: object | Buffer | string, options: ValidateOptionsType): Promise<any> {
    value = (value === null || value === undefined) ? new Object() : (Object.getPrototypeOf(value) ? value : Object.setPrototypeOf(value, Object.prototype)); // WORKAROUND: fix missing constructor in value
    const check = CheckArgumentValidityProvider.check(value, params.mask);
    if (check) {
        throw new Error('Invalid output received. Expected:   ' + JSON.stringify(params.mask));
    }
    return value;
};
