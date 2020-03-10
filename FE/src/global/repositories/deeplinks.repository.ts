import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DeeplinksRepository {

    private map: Map<keyof DeeplinksRepositoryTypes, DeeplinksImplementation<DeeplinksRepositoryTypes[keyof DeeplinksRepositoryTypes]>>;

    constructor() {
        this.map = new Map<keyof DeeplinksRepositoryTypes, DeeplinksImplementation<DeeplinksRepositoryTypes[keyof DeeplinksRepositoryTypes]>>();
        this.map.set('/echo', this.echo.bind(this));
        this.map.set('/auth/signin', this.authSignin.bind(this));
    }

    public getPaths(): { [path: string]: DeeplinksImplementation<any> } {
        return Array.from(this.map.keys()).reduce((o, r) => { return { ...o, [r]: this.map.get(<keyof DeeplinksRepositoryTypes>r) }; }, {});
    }

    public getHandler<K extends keyof DeeplinksRepositoryTypes>(path: K): DeeplinksImplementation<DeeplinksRepositoryTypes[K]> {
        return this.map.get(path);
    }

    //

    private echo(link: { extra: {}, host: string, path: string, scheme: string, url: string }, params: { [key: string]: string }): void {
        console.log('echo', arguments);
    }

    private authSignin(link: { extra: {}, host: string, path: string, scheme: string, url: string }, params: { credentials: string }): void {
        console.log('authSignin', arguments);
    }

}

export interface DeeplinksRepositoryTypes {
    '/echo': { [key: string]: string };
    '/auth/signin': { credentials: string };
}

export type DeeplinksImplementation<T> = (link: { extra: {}, host: string, path: string, scheme: string, url: string }, params: T) => void;
