import { Injectable } from '@angular/core';
import { Router, UrlTree, Navigation, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnimationOptions, NavigationOptions } from '@ionic/angular/providers/nav-controller';

import { RouteImplementation } from 'global/common/implementations/route.implementation';
import { LoggingService } from './logging.service';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {

    constructor(
        private readonly navController: NavController,
        private readonly router: Router,
        private readonly loggingService: LoggingService
    ) { }

    public navigate(type: 'Back', options?: AnimationOptions): Promise<boolean>;
    public navigate(type: 'Pop'): Promise<boolean>;
    public navigate<I, R, Q>(type: 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', route: RouteImplementation<I, R, Q>, params?: { input?: I; route?: R; query?: Q; fragment?: string; }, options?: Omit<NavigationOptionsG<I, R, Q>, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>): Promise<boolean>;
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
    private navigateBack<I, R, Q>(type: 'Back', options?: AnimationOptions): Promise<boolean> {
        const config: AnimationOptions = { animated: true, ...options };
        (this.navController as NavControllerG<I, R, Q>).back(config);
        return Promise.resolve(true);
    }
    private navigatePop<I, R, Q>(type: 'Pop'): Promise<boolean> {
        return (this.navController as NavControllerG<I, R, Q>).pop().then(_ => true, _ => false).catch(_ => false);
    }
    private navigateRoute<I, R, Q>(type: 'NavigateBack' | 'NavigateForward' | 'NavigateRoot', route?: RouteImplementation<I, R, Q>, params?: { input?: I; route?: R; query?: Q; fragment?: string; }, options?: Omit<NavigationOptionsG<I, R, Q>, 'state' | 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment'>): Promise<boolean> {
        params = { ...params };
        const config: NavigationOptionsG<I, R, Q> = { animated: true, ...options, state: { input: params.input }, queryParams: params.query, queryParamsHandling: 'preserve', fragment: params.fragment, preserveFragment: false };
        const url = this.getURL(route.path, params.route);
        switch (type) {
            case 'NavigateBack':
                return (this.navController as NavControllerG<I, R, Q>).navigateBack(url, config);
            case 'NavigateForward':
                return (this.navController as NavControllerG<I, R, Q>).navigateForward(url, config);
            case 'NavigateRoot':
                return (this.navController as NavControllerG<I, R, Q>).navigateRoot(url, config);
        }
    }

    public getNavigationParams<I, R, Q>(route: RouteImplementation<I, R, Q>): { input?: I; route?: R; query?: Q; fragment?: string; } {
        const navigation = this.router.getCurrentNavigation() as NavigationG<I, R, Q>;
        const params: { input?: I; route?: R; query?: Q; fragment?: string; } = {
            input: this.getInput<I>(route.defaultInput, navigation.extras.state),
            route: this.getRoute<R>(route.path, new URL(window.location.origin + navigation.finalUrl.toString()).pathname.replace(/^\/?/, '')),
            query: this.getQuery<Q>(navigation.finalUrl.queryParams),
            fragment: this.getFragment(navigation.finalUrl.fragment)
        };
        return params;
    }

    //

    public static getParams<I, R, Q>(route: RouteImplementation<I, R, Q>): { input?: I; route?: R; query?: Q; fragment?: string; } {
        return { input: route.defaultInput } as { input?: I; route?: R; query?: Q; fragment?: string; };
    }

    //

    private getURL<R>(path: string, route?: R): string {
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

    private getInput<I>(defaultInput?: I, state?: { input: I; }): I {
        return state ? state.input : defaultInput;
    }

    private getRoute<R>(path: string, url: string): R {
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
        }, {} as R) : undefined;
        if (mismatch) {
            this.loggingService.LOG('WARN', { class: RoutingService.name, function: this.getRoute.name, text: 'Mismatch between "path" and "url".' }, path, url);
            return undefined;
        } else {
            return (Object.keys(route).length > 0) ? route : undefined;
        }
    }

    private getQuery<Q>(queryParams: Q): Q {
        return (Object.keys(queryParams || {}).length > 0) ? queryParams : undefined;
    }

    private getFragment(fragment: string | null): string {
        return fragment || undefined;
    }

}

interface NavigationExtrasG<I, R, Q> extends NavigationExtras {
    queryParams?: Q | null;
    state: { input: I; };
}

interface UrlTreeG<I, R, Q> extends UrlTree {
    queryParams: Q;
}

interface NavigationOptionsG<I, R, Q> extends Omit<NavigationOptions, keyof NavigationExtras>, NavigationExtrasG<I, R, Q> { }

interface NavigationG<I, R, Q> extends Navigation {
    initialUrl: string | UrlTreeG<any, any, any>;
    extractedUrl: UrlTreeG<any, any, any>;
    finalUrl?: UrlTreeG<I, R, Q>;
    extras: NavigationExtrasG<I, R, Q>;
    previousNavigation: NavigationG<any, any, any> | null;
}

interface NavControllerG<I, R, Q> extends NavController {
    navigateForward(url: string | UrlTreeG<I, R, Q> | any[], options?: NavigationOptionsG<I, R, Q>): Promise<boolean>;
    navigateBack(url: string | UrlTreeG<I, R, Q> | any[], options?: NavigationOptionsG<I, R, Q>): Promise<boolean>;
    navigateRoot(url: string | UrlTreeG<I, R, Q> | any[], options?: NavigationOptionsG<I, R, Q>): Promise<boolean>;
}
