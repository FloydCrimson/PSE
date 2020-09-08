import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FChanFactoryImplementation, GetBoardsJSON, GetThreadsJSON, GetCatalogJSON, GetArchiveJSON, GetPageJSON, GetPostsJSON } from 'global/common/implementations/factories/fchan.factory.implementation';
import { ErrorRestImplementation } from 'global/common/implementations/error-rest.implementation';

export class NativeFChan extends FChanFactoryImplementation {

    constructor(
        private readonly http: HTTP
    ) {
        super();
        this.http.setDataSerializer('json');
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
        return from(this.http.get(url, {}, {})).pipe(
            map((result: HTTPResponse) => {
                const response: { success: boolean; response: O; } = { success: result.status === 200 || result.status === 304, response: JSON.parse(result.data) };
                return response;
            }),
            catchError(error => {
                return throwError({ error: error, statusCode: ('status' in error) ? error.status : -1 } as ErrorRestImplementation);
            })
        );
    }

}
