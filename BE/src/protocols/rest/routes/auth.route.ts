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
    SignOutOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    SignOutPOST: RouteImplementation<undefined, undefined, undefined>;
    LogInOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    LogInPOST: RouteImplementation<undefined, undefined, undefined>;
    LogOutOPTIONS: RouteImplementation<undefined, undefined, undefined>;
    LogOutPOST: RouteImplementation<undefined, undefined, undefined>;
}

export const AuthRoute: AuthRouteImplementation = {
    // /auth/email-available
    EmailAvailableOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/email-available' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    EmailAvailablePOST: {
        endpoint: { method: MethodType.POST, route: '/auth/email-available' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'AuthController', action: 'EmailAvailablePOST' }
    },
    // /auth/nickname-available
    NicknameAvailableOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/nickname-available' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    NicknameAvailablePOST: {
        endpoint: { method: MethodType.POST, route: '/auth/nickname-available' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'AuthController', action: 'NicknameAvailablePOST' }
    },
    // /auth/sign-in
    SignInOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/sign-in' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Content-Type'] })]
    },
    SignInPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/sign-in' },
        middlewares: [MI.CORSMiddleware()],
        handler: { controller: 'AuthController', action: 'SignInPOST' }
    },
    // /auth/sign-out
    SignOutOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/sign-out' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Authorization', 'Content-Type'] })]
    },
    SignOutPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/sign-out' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'AuthController', action: 'SignOutPOST' }
    },
    // /auth/log-in
    LogInOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/log-in' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Authorization', 'Content-Type'] })]
    },
    LogInPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/log-in' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'AuthController', action: 'LogInPOST' }
    },
    // /auth/log-out
    LogOutOPTIONS: {
        endpoint: { method: MethodType.OPTIONS, route: '/auth/log-out' },
        middlewares: [MI.CORSMiddleware({ allowedOrigin: '*', allowedMethods: [MethodType.OPTIONS, MethodType.POST], allowedHeaders: ['Authorization', 'Content-Type'] })]
    },
    LogOutPOST: {
        endpoint: { method: MethodType.POST, route: '/auth/log-out' },
        middlewares: [MI.CORSMiddleware(), MI.AuthMiddleware()],
        handler: { controller: 'AuthController', action: 'LogOutPOST' }
    }
};
