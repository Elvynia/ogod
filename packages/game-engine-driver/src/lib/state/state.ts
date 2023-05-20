import { Observable, ReplaySubject, Subject, share } from "rxjs";

export interface StateSubject<T> extends Subject<T> {
    getState<O = any>(path: string): Observable<O>;
    registerState<O>(path: string, state$: Observable<O>): Observable<O>;
    // removeState(path: string): void;
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
            share()
        );
        this.states[path].subscribe({
            // complete: () => this.removeState(path)
            complete: () => delete this.states[path]
        });
        return this.states[path];
    }

    // removeState(path: string): void {
    //     if (!this.states[path].closed) {
    //         this.states[path].unsubscribe();
    //     }
    //     delete this.states[path];
    // }
}
