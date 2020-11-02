import { RouteImplementation } from '../implementations/route.implementation';
import { Locals } from '../implementations/express.implementation';

export type ControllerMethodType<M extends RouteImplementation<any, any, any>> = M extends RouteImplementation<infer B, infer P, infer O> ? (locals: Locals, body: B, params: P, output: O) => Promise<O> : unknown;
