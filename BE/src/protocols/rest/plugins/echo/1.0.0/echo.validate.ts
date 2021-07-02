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

const EchoAuthPartialGETValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialGET'] = {
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

const EchoAuthPartialPOSTValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialPOST'] = {
    payload: VI.PayloadMaskValidateMethodFactory({ mask: {} }),
    query: VI.QueryMaskValidateMethodFactory({ mask: {} }),
    output: VI.OutputMaskValidateMethodFactory({ mask: {} })
};

export const EchoValidate: ValidatePluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoGET: EchoGETValidate,
    EchoPOST: EchoPOSTValidate,
    // /echo/echo-auth-full
    EchoAuthFullGET: EchoAuthFullGETValidate,
    EchoAuthFullPOST: EchoAuthFullPOSTValidate,
    // /echo/echo-auth-partial
    EchoAuthPartialGET: EchoAuthPartialGETValidate,
    EchoAuthPartialPOST: EchoAuthPartialPOSTValidate
};
