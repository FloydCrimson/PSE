import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FChanFactoryImplementation, GetBoardsJSON, GetThreadsJSON, GetCatalogJSON, GetArchiveJSON, GetPageJSON, GetPostsJSON } from 'global/common/implementations/factories/fchan.factory.implementation';

export class AngularFChan extends FChanFactoryImplementation {

    constructor(
        private readonly http: HttpClient
    ) {
        super();
    }

    public getBoards(): Observable<{ success: boolean; response: GetBoardsJSON; }> {
        const url: string = FChanFactoryImplementation.getBoardsUrl();
        return this.call(url);
    }

    public getThreads(params: { board: string; }): Observable<{ success: boolean; response: GetThreadsJSON; }> {
        const url: string = FChanFactoryImplementation.getThreadsUrl(params.board);
        return this.call(url);
    }

    public getCatalog(params: { board: string; }): Observable<{ success: boolean; response: GetCatalogJSON; }> {
        const url: string = FChanFactoryImplementation.getCatalogUrl(params.board);
        return this.call(url);
    }

    public getArchive(params: { board: string; }): Observable<{ success: boolean; response: GetArchiveJSON; }> {
        const url: string = FChanFactoryImplementation.getArchiveUrl(params.board);
        return this.call(url);
    }

    public getPage(params: { board: string; page: number; }): Observable<{ success: boolean; response: GetPageJSON; }> {
        const url: string = FChanFactoryImplementation.getPageUrl(params.board, params.page);
        return this.call(url);
    }

    public getPosts(params: { board: string; no: number; }): Observable<{ success: boolean; response: GetPostsJSON; }> {
        const url: string = FChanFactoryImplementation.getPostsUrl(params.board, params.no);
        return this.call(url);
    }

    //

    private call<O>(url: string): Observable<{ success: boolean; response: O; }> {
        return this.http.get(url).pipe(
            map((result: HttpResponse<O>) => {
                const response: { success: boolean; response: O; } = { success: result.status === 200 || result.status === 304, response: result.body };
                return response;
            }),
            catchError((error) => {
                const response: { success: boolean; response: O; } = { success: false, response: error };
                return of(response);
            })
        );
    }

}
