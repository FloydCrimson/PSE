import { Injectable } from '@angular/core';
import { Router, NavigationExtras, LoadChildren } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';

@Injectable()
export class PSERouteController {

    constructor(
        private readonly navController: NavController,
        private readonly router: Router
    ) { }

    public navigate<K extends keyof NavigateTypeE>(type: K, ...args: Parameters<NavigateTypeE[K]>) {
        switch (type) {
            case 'Back':
                return this.navigateBack(...(args as Parameters<NavigateTypeE['Back']>));
            case 'Pop':
                return this.navigatePop(...(args as Parameters<NavigateTypeE['Pop']>));
            case 'NavigateBack':
                return this.navigateRoute('navigateBack', ...(args as Parameters<NavigateTypeE['NavigateBack']>));
            case 'NavigateForward':
                return this.navigateRoute('navigateForward', ...(args as Parameters<NavigateTypeE['NavigateForward']>));
            case 'NavigateRoot':
                return this.navigateRoute('navigateRoot', ...(args as Parameters<NavigateTypeE['NavigateRoot']>));
            default:
                return Promise.reject(new Error('Unrecognized navigation type.'));
        }
    }

    private navigateBack(options?: AnimationOptions) {
        options = { animated: true, ...options };
        return this.navController.back(options);
    }

    private navigatePop() {
        return this.navController.pop();
    }

    private navigateRoute<I extends IInput, R extends IRoute, Q extends IQuery>(method: 'navigateBack' | 'navigateForward' | 'navigateRoot', route: PSERoute<I, R, Q>, params?: IParams<I, R, Q>, options?: IOptions<I, Q>) {
        const optionsG: NavigationOptionsG<I, Q> = { animated: true, ...options, state: { input: params?.input }, queryParams: params?.query, queryParamsHandling: 'preserve', fragment: params?.fragment, preserveFragment: false };
        const url = this.getURL(route.path, params?.route);
        return this.navController[method](url, optionsG);
    }

    //

    public getNavigationParams<I extends IInput, R extends IRoute, Q extends IQuery>(route: PSERoute<I, R, Q>): IParams<I, R, Q> | undefined {
        const navigation = this.router.getCurrentNavigation();
        return navigation?.finalUrl ? ({
            input: this.getInput<I>(navigation.extras.state as { input?: I; }),
            route: this.getRoute<R>(route.path, new URL(window.location.origin + navigation.finalUrl.toString()).pathname.replace(/^\/?/, '')),
            query: this.getQuery<Q>(navigation.finalUrl.queryParams as Q),
            fragment: this.getFragment(navigation.finalUrl.fragment)
        } as IParams<I, R, Q>) : undefined;
    }

    //

    public static getParams<I extends IInput, R extends IRoute, Q extends IQuery>(route: PSERoute<I, R, Q>): IParams<I, R, Q> {
        return {} as IParams<I, R, Q>;
    }

    //

    private getURL<R extends IRoute>(path: string, route?: R): string {
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

    private getInput<I extends IInput>(state?: { input?: I; }): I | undefined {
        return state?.input;
    }

    private getRoute<R extends IRoute>(path: string, url: string): R | undefined {
        const pathS = path.split('/');
        const urlS = url.split('/');
        let mismatch = pathS.length !== urlS.length;
        const route = !mismatch ? (pathS.reduce((r, p, i) => {
            if (p.match(/^:/)) {
                const key = p.replace(/^:/, '');
                r[key] = urlS[i];
            } else {
                mismatch = mismatch || p !== urlS[i];
            }
            return r;
        }, {} as { [key: string]: any; }) as R) : undefined;
        if (mismatch) {
            return undefined;
        } else {
            return (Object.keys(route ? (route as { [key: string]: any; }) : {}).length > 0) ? route : undefined;
        }
    }

    private getQuery<Q extends IQuery>(queryParams: Q): Q | undefined {
        return (Object.keys(queryParams ? (queryParams as { [key: string]: any; }) : {}).length > 0) ? queryParams : undefined;
    }

    private getFragment(fragment: string | null): string | undefined {
        return fragment || undefined;
    }

}

export type PSERoute<I extends IInput = undefined, R extends IRoute = undefined, Q extends IQuery = undefined> = {
    path: string;
    loadChildren: LoadChildren;
}

interface NavigateTypeE {
    Back: (options?: AnimationOptions) => void;
    Pop: () => Promise<void>;
    NavigateBack: <I extends IInput, R extends IRoute, Q extends IQuery>(route: PSERoute<I, R, Q>, params?: IParams<I, R, Q>, options?: IOptions<I, Q>) => Promise<boolean>;
    NavigateForward: <I extends IInput, R extends IRoute, Q extends IQuery>(route: PSERoute<I, R, Q>, params?: IParams<I, R, Q>, options?: IOptions<I, Q>) => Promise<boolean>;
    NavigateRoot: <I extends IInput, R extends IRoute, Q extends IQuery>(route: PSERoute<I, R, Q>, params?: IParams<I, R, Q>, options?: IOptions<I, Q>) => Promise<boolean>;
}

interface NavigationOptionsG<I extends IInput, Q extends IQuery> extends NavigationExtrasG<I, Q>, AnimationOptions { }

interface NavigationExtrasG<I extends IInput, Q extends IQuery> extends NavigationExtras {
    queryParams?: Q | null;
    state?: { input?: I; };
}

type IParams<I extends IInput, R extends IRoute, Q extends IQuery> = { input?: I; route?: R; query?: Q; fragment?: string; };
type IOptions<I extends IInput, Q extends IQuery> = Omit<NavigationOptionsG<I, Q>, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>;

type IInput = any | undefined;
type IRoute = { [key: string]: any; } | undefined;
type IQuery = { [key: string]: any; } | undefined;
