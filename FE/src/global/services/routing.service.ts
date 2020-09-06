import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnimationOptions, NavigationOptions } from '@ionic/angular/providers/nav-controller';

import { RouteImplementation } from 'global/common/implementations/route.implementation';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {

    constructor(
        private readonly navController: NavController,
        private readonly router: Router
    ) { }

    public navigate(type: 'Back', options?: AnimationOptions): Promise<boolean>;
    public navigate(type: 'Pop'): Promise<boolean>;
    public navigate<I, R, Q>(type: 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', route: RouteImplementation<I, R, Q>, params?: { input?: I; route?: R; query?: Q; fragment?: string; }, options?: Omit<NavigationOptions, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>): Promise<boolean>;
    public navigate(type: 'Back' | 'Pop' | 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', ...args: any[]): Promise<boolean> {
        switch (type) {
            case 'Back':
                return this.navigateBack(type, ...args);
            case 'Pop':
                return this.navigatePop(type);
            case 'NavigateBack':
            case 'NavigateForward':
            case 'NavigateRoot':
                return this.navigateRoute(type, ...args);
            default:
                return Promise.reject(new Error('Unrecognized navigation type.'));
        }
    }
    private navigateBack(type: 'Back', options?: AnimationOptions): Promise<boolean> {
        const config: AnimationOptions = { animated: true, ...options };
        this.navController.back(config);
        return Promise.resolve(true);
    }
    private navigatePop(type: 'Pop'): Promise<boolean> {
        return this.navController.pop().then(_ => true, _ => false).catch(_ => false);
    }
    private navigateRoute<I, R, Q>(type: 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', route?: RouteImplementation<I, R, Q>, params?: { input?: I; route?: R; query?: Q; fragment?: string; }, options?: Omit<NavigationOptions, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>): Promise<boolean> {
        params = { ...params };
        const config: NavigationOptions = { animated: true, ...options, state: { input: params.input }, queryParams: params.query, queryParamsHandling: 'preserve', fragment: params.fragment as any, preserveFragment: false };
        const url = this.getURL(route.path, params.route);
        switch (type) {
            case 'NavigateBack':
                return this.navController.navigateBack(url, config);
            case 'NavigateForward':
                return this.navController.navigateForward(url, config);
            case 'NavigateRoot':
                return this.navController.navigateRoot(url, config);
        }
    }

    public getNavigationParams<I, R, Q>(route: RouteImplementation<I, R, Q>): { input?: I; route?: R; query?: Q; fragment?: string; } {
        const navigation = this.router.getCurrentNavigation();
        const params: { input?: I; route?: R; query?: Q; fragment?: string; } = {
            input: this.getInput(route.defaultInput, navigation.extras.state),
            route: this.getRoute(route.path, new URL(window.location.origin + navigation.finalUrl.toString()).pathname.replace(/^\/?/, '')),
            query: this.getQuery(navigation.finalUrl.queryParams),
            fragment: this.getFragment(navigation.finalUrl.fragment)
        };
        return params;
    }

    //

    public static getParams<I, R, Q>(route: RouteImplementation<I, R, Q>): { input?: I; route?: R; query?: Q; fragment?: string; } {
        return { input: route.defaultInput } as { input?: I; route?: R; query?: Q; fragment?: string; };
    }

    //

    private getURL<R = { [key: string]: any; } | null>(path: string, route?: R): string {
        const url = route ? path.split('/').map((p) => {
            if (p.match(/^:/)) {
                const key = p.replace(/^:/, '');
                if (key in route) {
                    return route[key];
                }
            }
            return p;
        }).join('/') : path;
        return url;
    }

    private getInput<I = any | null>(defaultInput?: I, state?: { [k: string]: any; }): I {
        return state ? (state.input as any) : defaultInput;
    }

    private getRoute<R = { [key: string]: any; } | null>(path: string, url: string): R {
        const pathS = path.split('/');
        const urlS = url.split('/');
        let mismatch = pathS.length !== urlS.length;
        const route = !mismatch ? pathS.reduce((r, p, i) => {
            if (p.match(/^:/)) {
                const key = p.replace(/^:/, '');
                r[key] = urlS[i];
            } else {
                mismatch = mismatch || p !== urlS[i];
            }
            return r;
        }, {}) : undefined;
        if (mismatch) {
            console.warn('Mismatch between "path" and "url".', path, url);
            return undefined;
        } else {
            return (Object.keys(route).length > 0) ? (route as any) : undefined;
        }
    }

    private getQuery<Q = { [key: string]: any; } | null>(queryParams: { [key: string]: any; }): Q {
        return Object.keys(queryParams || {}).length > 0 ? (queryParams as any) : undefined
    }

    private getFragment<F = string>(fragment: string): F {
        return (fragment as any) || undefined;
    }

}
