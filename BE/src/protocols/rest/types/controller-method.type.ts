import { Request, Response } from 'express';

import { RouteImplementation } from "../implementations/route.implementation";

export type ControllerMethodType<M extends RouteImplementation> = M extends RouteImplementation<infer B, infer P, infer O> ? (request: Request, response: Response) => Promise<O> : unknown;
