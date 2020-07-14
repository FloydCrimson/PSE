import { RouteImplementation } from '../implementations/route.implementation';
import { MethodType } from '../types/method.type';
import * as MI from '../middlewares.index';

export interface AuthRouteImplementation {
    EmailAvailableOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    EmailAvailablePOST: RouteImplementation<{ email: string; }, undefined, { email: boolean; }>;
    NicknameAvailableOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    NicknameAvailablePOST: RouteImplementation<{ nickname: string; }, undefined, { nickname: boolean; }>;
    SignInOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    SignInPOST: RouteImplementation<{ email: string; nickname: string; password: string; }, undefined, { email: boolean; nickname: boolean; success: boolean; }>;
    SignOutPOST: RouteImplementation<undefined, undefined, undefined>;
    LogInOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    LogInPOST: RouteImplementation<undefined, undefined, undefined>;
    LogOutPOST: RouteImplementation<undefined, undefined, undefined>;
}

export const AuthRoute: AuthRouteImplementation = {
    // /auth/emailAvailable
    EmailAvailableOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/emailAvailable' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    EmailAvailablePOST: {
        endpoint: { method: MethodType.POST, route: '/auth/emailAvailable' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'AuthController', action: 'emailAvailable' }
    },
    // /auth/nicknameAvailable
    NicknameAvailableOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/nicknameAvailable' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    NicknameAvailablePOST: {
        endpoint: { method: MethodType.POST, route: '/auth/nicknameAvailable' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'AuthController', action: 'nicknameAvailable' }
    },
    // /auth/signin
    SignInOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/signin' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    SignInPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/signin' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'AuthController', action: 'signin' }
    },
    // /auth/signout
    SignOutPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/signout' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'AuthController', action: 'signout' }
    },
    // /auth/login
    LogInOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/login' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Authorization', 'Content-Type'] })]
    },
    LogInPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/login' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'AuthController', action: 'login' }
    },
    // /auth/logout
    LogOutPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/logout' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'AuthController', action: 'logout' }
    }
};
