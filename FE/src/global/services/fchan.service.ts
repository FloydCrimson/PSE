import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, timeout, tap, skip } from 'rxjs/operators';

import { FChanFactory } from 'global/factories/fchan.factory';

import { GetBoardsJSON, GetCatalogJSON, GetPostsJSON, GetArchiveJSON } from 'global/common/implementations/factories/fchan.factory.implementation';

@Injectable({
    providedIn: 'root'
})
export class FChanService {

    private cacheBoards: BehaviorSubject<{ success: boolean; response: GetBoardsJSON; }>;
    private cacheCatalog: Map<string, BehaviorSubject<{ success: boolean; response: GetCatalogJSON; }>>;
    private cacheArchive: Map<string, BehaviorSubject<{ success: boolean; response: GetArchiveJSON; }>>;
    private cachePosts: Map<string, BehaviorSubject<{ success: boolean; response: GetPostsJSON; }>>;

    constructor(
        private readonly fchanFactory: FChanFactory
    ) {
        this.cacheBoards = new BehaviorSubject<{ success: boolean; response: GetBoardsJSON; }>(null);
        this.cacheCatalog = new Map<string, BehaviorSubject<{ success: boolean; response: GetCatalogJSON; }>>();
        this.cacheArchive = new Map<string, BehaviorSubject<{ success: boolean; response: GetArchiveJSON; }>>();
        this.cachePosts = new Map<string, BehaviorSubject<{ success: boolean; response: GetPostsJSON; }>>();
    }

    public getBoards(cache: boolean): Observable<{ success: boolean; response: GetBoardsJSON; }> {
        const behavior = this.cacheBoards;
        return this.cacher(behavior, this.fchanFactory.get('API').getBoards(), cache);
    }

    public getCatalog(board: string, cache: boolean): Observable<{ success: boolean; response: GetCatalogJSON; }> {
        if (!this.cacheCatalog.has(board)) {
            this.cacheCatalog.set(board, new BehaviorSubject<{ success: boolean; response: GetCatalogJSON; }>(null));
        }
        const behavior = this.cacheCatalog.get(board);
        return this.cacher(behavior, this.fchanFactory.get('API').getCatalog(board), cache);
    }

    public getArchive(board: string, cache: boolean): Observable<{ success: boolean; response: GetArchiveJSON; }> {
        if (!this.cacheArchive.has(board)) {
            this.cacheArchive.set(board, new BehaviorSubject<{ success: boolean; response: GetArchiveJSON; }>(null));
        }
        const behavior = this.cacheArchive.get(board);
        return this.cacher(behavior, this.fchanFactory.get('API').getArchive(board), cache);
    }

    public getPosts(board: string, no: number, cache: boolean): Observable<{ success: boolean; response: GetPostsJSON; }> {
        if (!this.cachePosts.has(board + '+' + no)) {
            this.cachePosts.set(board + '+' + no, new BehaviorSubject<{ success: boolean; response: GetPostsJSON; }>(null));
        }
        const behavior = this.cachePosts.get(board + '+' + no);
        return this.cacher(behavior, this.fchanFactory.get('API').getPosts(board, no), cache);
    }

    // private

    private cacher<T>(behavior: BehaviorSubject<{ success: boolean; response: T; }>, observable: Observable<{ success: boolean; response: T; }>, cache: boolean): Observable<{ success: boolean; response: T; }> {
        const value = behavior.getValue();
        if (cache && value !== null && value.success) {
            return behavior.asObservable().pipe(
                take(1)
            );
        } else {
            observable.pipe(
                timeout(60000),
                tap((result) => behavior.next(result))
            ).subscribe();
            return behavior.asObservable().pipe(
                skip(1),
                take(1)
            );
        }
    }

}
