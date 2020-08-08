import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';

import { RouteImplementation } from 'global/common/implementations/route.implementation';

@Injectable({
    providedIn: 'root'
})
export class RoutingService {

    private paramsMap = new Map<string, any>();

    constructor(
        private readonly navController: NavController,
        private readonly router: Router
    ) { }

    public navigate<I, O>(type: 'Forward' | 'Back' | 'Root', route: RouteImplementation<I, O>, params?: I, options?: NavigationOptions): Promise<boolean> {
        options = { animated: true, ...options, state: {} };
        if (params) {
            const token = route.path;
            options.state.token = token;
            this.paramsMap.set(token, params);
        }
        switch (type) {
            case 'Forward':
                return this.navController.navigateForward(route.path, options);
            case 'Back':
                return this.navController.navigateBack(route.path, options);
            case 'Root':
                return this.navController.navigateRoot(route.path, options);
            default:
                return Promise.reject(new Error('Unrecognized navigation type.'));
        }
    }

    public getNavigationParams<I, O>(route: RouteImplementation<I, O>): I {
        const navigation = this.router.getCurrentNavigation();
        if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.token && navigation.extras.state.token === route.path) {
            const token = navigation.extras.state.token;
            const params: I = this.paramsMap.get(token);
            this.paramsMap.delete(token);
            return params;
        } else {
            return undefined;
        }
    }

}
