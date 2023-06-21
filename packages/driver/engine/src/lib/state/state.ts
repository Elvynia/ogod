import { Observable, ReplaySubject, Subject, share, tap } from "rxjs";

export interface StateSubject<T> extends Subject<T> {
    getState<O = any>(path: string): Observable<O>;
    registerState<O>(path: string, state$: Observable<O>): Observable<O>;
}

export class StateSubjectDefault<T extends object> extends ReplaySubject<T> implements StateSubject<T> {
    states: Record<string, Observable<any>>; // FIXME: Should be BehaviorSubject ?

    constructor(bufferCount: number = 1) {
        super(bufferCount);
        this.states = {};
    }

    getState<O = any>(path: string): Observable<O> {
        return this.states[path];
    }

    registerState<O>(path: string, state$: Observable<O>): Observable<O> {
        this.states[path] = state$.pipe(
            share(),
            tap({
                finalize: () => delete this.states[path]
            })
        );
        return this.states[path];
    }
}
