import * as Hapi from '@hapi/hapi';

import { RouteImplementation } from '../implementations/route.implementation';
import { DispatcherService } from '../services/dispatcher.service';
import { ExtensionObjectFactoryType } from '../types/extension.type';

export type CORSExtensionObjectFactoryParams = { ACAOrigin?: '*' | string[]; ACAMethods?: '*' | RouteImplementation['method'][]; ACAHeaders?: '*' | string[]; };

export const CORSExtensionObjectFactory: ExtensionObjectFactoryType<CORSExtensionObjectFactoryParams> = (params: CORSExtensionObjectFactoryParams) => {
    return {
        method: (dispatcherService: DispatcherService) => async function (request: Hapi.Request, h: Hapi.ResponseToolkit, err?: Error): Promise<any> {
            const response = request.response as Hapi.ResponseObject;
            if (params.ACAOrigin === '*') {
                response.header('Access-Control-Allow-Origin', '*');
            } else if (params.ACAOrigin?.length > 0) {
                response.header('Access-Control-Allow-Origin', params.ACAOrigin.join(', '));
            }
            if (request.method.toUpperCase() as RouteImplementation['method'] === 'OPTIONS') {
                if (params.ACAMethods === '*') {
                    response.header('Access-Control-Allow-Methods', '*');
                } else if (params.ACAMethods?.length > 0) {
                    response.header('Access-Control-Allow-Methods', params.ACAMethods.map(m => m.toUpperCase()).join(', '));
                }
                if (params.ACAHeaders === '*') {
                    response.header('Access-Control-Allow-Headers', '*');
                } else if (params.ACAHeaders?.length > 0) {
                    response.header('Access-Control-Allow-Headers', params.ACAHeaders.join(', '));
                }
            }
            return response;
        }
    };
};
