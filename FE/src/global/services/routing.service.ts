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

    public navigateForward<P>(route: RouteImplementation<P>, params?: P, options?: NavigationOptions): Promise<boolean> {
        options = { animated: true, animationDirection: 'forward', ...options };
        if (params) {
            const token = Date.now().toString();
            options.state = options.state || {};
            options.state.token = token;
            this.paramsMap.set(token, params);
        }
        return this.navController.navigateForward(route.path, options);
    }

    public navigateBack<P>(route: RouteImplementation<P>, params?: P, options?: NavigationOptions): Promise<boolean> {
        options = { animated: true, animationDirection: 'back', ...options };
        if (params) {
            const token = Date.now().toString();
            options.state = options.state || {};
            options.state.token = token;
            this.paramsMap.set(token, params);
        }
        return this.navController.navigateBack(route.path, options);
    }

    public navigateRoot<P>(route: RouteImplementation<P>, params?: P, options?: NavigationOptions): Promise<boolean> {
        options = { animated: true, ...options };
        if (params) {
            const token = Date.now().toString();
            options.state = options.state || {};
            options.state.token = token;
            this.paramsMap.set(token, params);
        }
        return this.navController.navigateRoot(route.path, options);
    }

    public getNavigationParams<P>(route: RouteImplementation<P>, keep: boolean = false): P {
        const navigation = this.router.getCurrentNavigation();
        if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.token) {
            const token = navigation.extras.state.token;
            const params: P = this.paramsMap.get(token);
            if (!keep) {
                this.paramsMap.delete(token);
            }
            return params;
        } else {
            return undefined;
        }
    }

    public clearNavigationParams(): void {
        this.paramsMap.clear();
    }

}
