import { Observable } from 'rxjs';

export interface SocketFactoryImplementation {
    open(url: string): Observable<boolean>;
    close(): Observable<boolean>;
    send(message: Object): Observable<boolean>;
    receive(): Observable<Object>;
}
