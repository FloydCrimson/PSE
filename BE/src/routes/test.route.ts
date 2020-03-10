import { RouteImplementation } from '../common/implementations/route.implementation';
import { MethodType } from '../common/types/method.type';
import * as MI from '../middlewares.index';

export interface TestRouteImplementation {
    TestGET: RouteImplementation<undefined, undefined, undefined>;
}

export const TestRoute: TestRouteImplementation = {
    // /test
    TestGET: {
        endpoint: { method: MethodType.GET, route: '/test' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'TestController', action: 'test' }
    }
};
