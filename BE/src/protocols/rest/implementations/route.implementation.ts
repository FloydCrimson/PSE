import { ControllerServiceImplementation } from '../services/controller.service';
import { MethodType } from '../types/method.type';
import { Masks } from '../providers/controller-method-wrapper.provider';
import { MiddlewareImplementation } from './middleware.implementation';

export interface RouteImplementation<B = undefined, P = undefined, O = undefined> {
    endpoint: { method: MethodType; route: string; };
    middlewares?: (MiddlewareImplementation<any> extends (...args: any) => infer R ? R : any)[];
    handler?: { controller: keyof ControllerServiceImplementation; action: string; };
    maskB?: Masks;
    maskP?: Masks;
    maskO?: Masks;
}
