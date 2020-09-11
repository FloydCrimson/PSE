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

    public getThreads(board: string): Observable<{ success: boolean; response: GetThreadsJSON; }> {
        const url: string = FChanFactoryImplementation.getThreadsUrl(board);
        return this.call(url);
    }

    public getCatalog(board: string): Observable<{ success: boolean; response: GetCatalogJSON; }> {
        const url: string = FChanFactoryImplementation.getCatalogUrl(board);
        return this.call(url);
    }

    public getArchive(board: string): Observable<{ success: boolean; response: GetArchiveJSON; }> {
        const url: string = FChanFactoryImplementation.getArchiveUrl(board);
        return this.call(url);
    }

    public getPage(board: string, page: number): Observable<{ success: boolean; response: GetPageJSON; }> {
        const url: string = FChanFactoryImplementation.getPageUrl(board, page);
        return this.call(url);
    }

    public getPosts(board: string, no: number): Observable<{ success: boolean; response: GetPostsJSON; }> {
        const url: string = FChanFactoryImplementation.getPostsUrl(board, no);
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
