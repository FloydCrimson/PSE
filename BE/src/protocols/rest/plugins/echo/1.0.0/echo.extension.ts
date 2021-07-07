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

const EchoAuthFullCryptedOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthFullCryptedOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const EchoAuthPartialOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

const EchoAuthPartialCryptedOPTIONSExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation>['EchoAuthPartialCryptedOPTIONS'] = {
    onPreResponse: [EI.CORSExtensionObjectFactory({ ACAMethods: ['OPTIONS', 'GET', 'POST'], ACAHeaders: ['Content-Type', 'Authorization'] })]
};

export const EchoExtension: ExtensionPluginType<EchoRouteImplementation, EchoMethodImplementation> = {
    // /echo/echo
    EchoOPTIONS: EchoOPTIONSExtension,
    // /echo/echo-auth-full
    EchoAuthFullOPTIONS: EchoAuthFullOPTIONSExtension,
    // /echo/echo-auth-full-crypted
    EchoAuthFullCryptedOPTIONS: EchoAuthFullCryptedOPTIONSExtension,
    // /echo/echo-auth-partial
    EchoAuthPartialOPTIONS: EchoAuthPartialOPTIONSExtension,
    // /echo/echo-auth-partial-crypted
    EchoAuthPartialCryptedOPTIONS: EchoAuthPartialCryptedOPTIONSExtension
};
