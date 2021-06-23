import { RouteImplementation } from '../../../implementations/route.implementation';

export interface EchoRouteImplementation {
    EchoOPTIONS: RouteImplementation;
    EchoGET: RouteImplementation<undefined, any, any>;
    EchoPOST: RouteImplementation<any, undefined, any>;
    EchoAuthOPTIONS: RouteImplementation;
    EchoAuthGET: RouteImplementation<undefined, any, any>;
    EchoAuthPOST: RouteImplementation<any, undefined, any>;
}
