import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';

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

    public navigate<I, R, Q, F>(type: 'Forward' | 'Back' | 'Root', route: RouteImplementation<I, R, Q, F>, params?: { input?: I; route?: R; query?: Q; fragment?: F; }, options?: Omit<NavigationOptions, 'queryParams' | 'preserveQueryParams' | 'queryParamsHandling' | 'fragment' | 'preserveFragment' | 'state'>): Promise<boolean> {
        params = { ...params };
        const config: NavigationOptions = { animated: true, ...options, queryParams: params.query, queryParamsHandling: 'preserve', fragment: params.fragment as any, preserveFragment: false };
        const path = this.getPath(route.path, params.route);
        if (Object.keys(params).length > 0) {
            this.map.set(path, params);
        }
        switch (type) {
            case 'Forward':
                return this.navController.navigateForward(path, config);
            case 'Back':
                return this.navController.navigateBack(path, config);
            case 'Root':
                return this.navController.navigateRoot(path, config);
            default:
                return Promise.reject(new Error('Unrecognized navigation type.'));
        }
    }

    public getNavigationParams<I, R, Q, F>(route: RouteImplementation<I, R, Q, F>): { input?: I; route?: R; query?: Q; fragment?: F; } {
        const path = this.router.getCurrentNavigation().extractedUrl.toString().replace(/^\/+/, '').replace(/#.*$/, '').replace(/\?.*$/, '');
        if (this.map.has(path)) {
            const params = this.map.get(path);
            this.map.delete(path);
            return params;
        } else {
            return {};
        }
    }

    //

    private getPath<R = undefined>(path: string, route?: R): string {
        if (route) {
            for (const key in route) {
                const regex = new RegExp([`(^:${key}$)`, `(^:${key}\\/)`, `(\\/:${key}$)`, `(\\/:${key}\\/)`].join('|'), 'g');
                const value = (route as any)[key];
                path = path.replace(regex, (found) => found.replace(`:${key}`, value));
            }
        }
        return path;
    }

}
