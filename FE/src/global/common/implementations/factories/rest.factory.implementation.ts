import { Observable } from 'rxjs';

export interface RestFactoryImplementation {
    get<B, P, O>(url: string, headers: { [key: string]: string }, input: { body: B, params: P }): Observable<{ status: number; headers: { [key: string]: string }; output: { data: O; }; }>;
    post<B, P, O>(url: string, headers: { [key: string]: string }, input: { body: B, params: P }): Observable<{ status: number; headers: { [key: string]: string }; output: { data: O; }; }>;
}
