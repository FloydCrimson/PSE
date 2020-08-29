import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnimationOptions, NavigationOptions } from '@ionic/angular/providers/nav-controller';

import { RouteImplementation } from 'global/common/implementations/route.implementation';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {

    private map = new Map<string, { input?: any; route?: any; query?: any; fragment?: any; }>();

    constructor(
        private readonly navController: NavController,
        private readonly router: Router
    ) { }

    public navigate(type: 'Back', options?: AnimationOptions): Promise<boolean>;
    public navigate(type: 'Pop'): Promise<boolean>;
    public navigate<I, R, Q, F>(type: 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', route: RouteImplementation<I, R, Q, F>, params?: { input?: I; route?: R; query?: Q; fragment?: F; }, options?: Omit<NavigationOptions, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>): Promise<boolean>;
    public navigate<I, R, Q, F>(type: 'Back' | 'Pop' | 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', ...args: any[]): Promise<boolean> {
        switch (type) {
            case 'Back':
                return this.navigateBack(type, ...args);
            case 'Pop':
                return this.navigatePop(type);
            case 'NavigateBack':
            case 'NavigateForward':
            case 'NavigateRoot':
                return this.navigateRoute<I, R, Q, F>(type, ...args);
            default:
                return Promise.reject(new Error('Unrecognized navigation type.'));
        }
    }
    private navigateBack(type: 'Back', options?: AnimationOptions): Promise<boolean> {
        options = { ...options };
        const config: AnimationOptions = { animated: true, ...options };
        this.navController.back(config);
        return Promise.resolve(true);
    }
    private navigatePop(type: 'Pop'): Promise<boolean> {
        return this.navController.pop().then(_ => true, _ => false).catch(_ => false);
    }
    private navigateRoute<I, R, Q, F>(type: 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', route?: RouteImplementation<I, R, Q, F>, params?: { input?: I; route?: R; query?: Q; fragment?: F; }, options?: Omit<NavigationOptions, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>): Promise<boolean> {
        params = { ...params };
        const config: NavigationOptions = { animated: true, ...options, queryParams: params.query, queryParamsHandling: 'preserve', fragment: params.fragment as any, preserveFragment: false };
        const url = this.getURL(route.path, params.route);
        this.map.set(url, params);
        switch (type) {
            case 'NavigateBack':
                return this.navController.navigateBack(url, config);
            case 'NavigateForward':
                return this.navController.navigateForward(url, config);
            case 'NavigateRoot':
                return this.navController.navigateRoot(url, config);
        }
    }

    public getNavigationParams<I, R, Q, F>(route: RouteImplementation<I, R, Q, F>): { input?: I; route?: R; query?: Q; fragment?: F; } {
        try {
            const formatted = new URL('http://mockedhost' + this.router.getCurrentNavigation().finalUrl.toString());
            const url = formatted.pathname.replace(/^\/?/, '');
            if (this.map.has(url)) { // from this.navigate
                const params = this.map.get(url);
                this.map.delete(url);
                return params;
            } else { // from url
                let params: { input?: I; route?: R; query?: Q; fragment?: F; } = {};
                params.input = route.default;
                params.route = this.getRoute(route.path, url);
                params.query = this.getQuery(formatted.search);
                params.fragment = this.getFragment(formatted.hash);
                return params;
            }
        } catch (error) {
            return null;
        }
    }

    //

    public static getParams<I, R, Q, F>(route: RouteImplementation<I, R, Q, F>): { input?: I; route?: R; query?: Q; fragment?: F; } {
        return { input: route.default } as { input?: I; route?: R; query?: Q; fragment?: F; };
    }

    //

    private getURL<R = undefined>(path: string, route?: R): string {
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

    private getRoute<R = undefined>(path: string, url: string): R {
        const pathS = path.split('/');
        const urlS = url.split('/');
        const route = pathS.length === urlS.length ? pathS.reduce((r, p, i) => {
            if (p.match(/^:/)) {
                const key = p.replace(/^:/, '');
                r[key] = urlS[i];
            }
            return r;
        }, {} as R) : undefined;
        return route;
    }

    private getQuery<Q = undefined>(search: string): Q {
        search = search.replace(/^\??/, '');
        return search ? search.split('&').reduce((q, s) => {
            const sS = s.split('=');
            q[sS[0]] = decodeURIComponent(sS[1] || '');
            return q;
        }, {} as Q) : undefined;
    }

    private getFragment<F = undefined>(hash: string): F {
        hash = hash.replace(/^#?/, '');
        return (hash as any as F) || undefined;
    }

}
