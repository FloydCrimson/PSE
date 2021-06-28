import { ExtensionPluginType } from '../../../types/extension.type';
import { EchoRouteImplementation } from './echo.implementation';
import { EchoMethodImplementation } from '../common/echo.implementation';

import * as EI from '../../../extensions.index';

const EchoOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['Content-Type'] })]
};

const EchoAuthFullOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthFullOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const EchoAuthPartialOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

export const EchoExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoOPTIONS: EchoOPTIONSExtension,
    // /echo/echo-auth-full
    EchoAuthFullOPTIONS: EchoAuthFullOPTIONSExtension,
    // /echo/echo-auth-partial
    EchoAuthPartialOPTIONS: EchoAuthPartialOPTIONSExtension
};
