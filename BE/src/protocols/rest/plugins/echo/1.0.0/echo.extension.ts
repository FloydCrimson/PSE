import { ExtensionPluginType } from '../../../types/extension.type';
import { EchoRouteImplementation } from './echo.implementation';
import { EchoMethodImplementation } from '../common/echo.implementation';

import * as EI from '../../../extensions.index';

const EchoOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['content-type'] })]
};

const EchoAuthOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['content-type', 'authorization'] })]
};

export const EchoExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoOPTIONS: EchoOPTIONSExtension,
    // /echo/echo-auth
    EchoAuthOPTIONS: EchoAuthOPTIONSExtension
};
