import { ValidatePluginType } from '../../../types/validate.type';
import { EchoRouteImplementation } from './echo.implementation';
import { EchoMethodImplementation } from '../common/echo.implementation';

import * as VI from '../../../validates.index';

const EchoGETValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoGET'] = {
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoPOSTValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoAuthFullGETValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthFullGET'] = {
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoAuthFullPOSTValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthFullPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoAuthFullCryptedGETValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthFullCryptedGET'] = {
    query: VI.QueryMaskValidateMethodFactory({ mask: {}, crypted: true }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {}, crypted: true })
};

const EchoAuthFullCryptedPOSTValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthFullCryptedPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {}, crypted: true }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {}, crypted: true }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {}, crypted: true })
};

const EchoAuthPartialGETValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialGET'] = {
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoAuthPartialPOSTValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoAuthPartialCryptedGETValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialCryptedGET'] = {
    query: VI.QueryMaskValidateMethodFactory({ mask: {}, crypted: true }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {}, crypted: true })
};

const EchoAuthPartialCryptedPOSTValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialCryptedPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {}, crypted: true }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {}, crypted: true }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {}, crypted: true })
};

export const EchoValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoGET: EchoGETValidate,
    EchoPOST: EchoPOSTValidate,
    // /echo/echo-auth-full
    EchoAuthFullGET: EchoAuthFullGETValidate,
    EchoAuthFullPOST: EchoAuthFullPOSTValidate,
    // /echo/echo-auth-full-crypted
    EchoAuthFullCryptedGET: EchoAuthFullCryptedGETValidate,
    EchoAuthFullCryptedPOST: EchoAuthFullCryptedPOSTValidate,
    // /echo/echo-auth-partial
    EchoAuthPartialGET: EchoAuthPartialGETValidate,
    EchoAuthPartialPOST: EchoAuthPartialPOSTValidate,
    // /echo/echo-auth-partial-crypted
    EchoAuthPartialCryptedGET: EchoAuthPartialCryptedGETValidate,
    EchoAuthPartialCryptedPOST: EchoAuthPartialCryptedPOSTValidate
};
