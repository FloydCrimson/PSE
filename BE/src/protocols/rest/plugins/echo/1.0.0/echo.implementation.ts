import { RouteImplementation } from '../../../implementations/route.implementation';

export interface EchoRouteImplementation {
    EchoOPTIONS: RouteImplementation;
    EchoGET: RouteImplementation<undefined, any, any>;
    EchoPOST: RouteImplementation<any, undefined, any>;
    EchoAuthFullOPTIONS: RouteImplementation;
    EchoAuthFullGET: RouteImplementation<undefined, any, any>;
    EchoAuthFullPOST: RouteImplementation<any, undefined, any>;
    EchoAuthPartialOPTIONS: RouteImplementation;
    EchoAuthPartialGET: RouteImplementation<undefined, any, any>;
    EchoAuthPartialPOST: RouteImplementation<any, undefined, any>;
}
