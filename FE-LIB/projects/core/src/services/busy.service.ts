import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class PSEBusyService {

    private map$ = new BehaviorSubject(new Map<(string | number), boolean>());

    constructor() { }

    public mark(tokens: (string | number)[]): void {
        const map = this.map$.getValue();
        tokens.forEach((token) => map.set(token, true));
        this.map$.next(map);
    }

    public unmark(tokens: (string | number)[]): void {
        const map = this.map$.getValue();
        tokens.forEach((token) => map.set(token, false));
        this.map$.next(map);
    }

    public check(tokens: (string | number)[]): Observable<boolean> {
        return this.map$.asObservable().pipe(
            map((map) => tokens.some((token) => !!map.get(token))),
            distinctUntilChanged()
        );
    }

}
