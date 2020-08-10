import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';

import { RouteImplementation } from 'global/common/implementations/route.implementation';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {

    private map = new Map<string, { input?: any; query?: any; route?: any; }>();

    constructor(
        private readonly navController: NavController,
        private readonly router: Router
    ) { }

    public navigate<I = undefined, Q = undefined, R = undefined>(type: 'Forward' | 'Back' | 'Root', route: RouteImplementation<I, Q, R>, params?: { input?: I; query?: Q; route?: R; }, options?: NavigationOptions): Promise<boolean> {
        params = { ...params };
        options = { animated: true, queryParamsHandling: 'preserve', ...options, queryParams: params.query, state: {} };
        const token = route.path;
        options.state.token = token;
        this.map.set(token, params);
        switch (type) {
            case 'Forward':
                return this.navController.navigateForward(this.getPath(route.path, params.route), options);
            case 'Back':
                return this.navController.navigateBack(this.getPath(route.path, params.route), options);
            case 'Root':
                return this.navController.navigateRoot(this.getPath(route.path, params.route), options);
            default:
                return Promise.reject(new Error('Unrecognized navigation type.'));
        }
    }

    public getNavigationParams<I = undefined, Q = undefined, R = undefined>(route: RouteImplementation<I, Q, R>): { input?: I; query?: Q; route?: R; } {
        const navigation = this.router.getCurrentNavigation();
        if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.token && navigation.extras.state.token === route.path) {
            const token = navigation.extras.state.token;
            const { input, query, route } = this.map.get(token);
            this.map.delete(token);
            return { input, query, route };
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
