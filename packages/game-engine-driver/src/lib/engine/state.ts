import { Observable, Subject } from "rxjs";
import { makeUpdate$ } from "../update/make";
import { UpdateState } from "../update/state";

export type EngineFn<U = UpdateState> = (update: U) => void;

export interface EngineSubject<U = UpdateState> extends Subject<U> {
    renders: EngineFn<U>[];
    systems: EngineFn<U>[];
    readonly reflect$: Subject<U>;
}

export class EngineSubjectDefault<U = UpdateState> extends Subject<U> implements EngineSubject<U> {
    readonly reflect$: Subject<U>;
    renders: EngineFn<U>[];
    systems: EngineFn<U>[];

    constructor(update$: Observable<U> = makeUpdate$() as Observable<U>) {
        super();
        this.reflect$ = new Subject();
        this.renders = [];
        this.systems = [];
        update$.subscribe(this);
    }

    override next(value: U): void {
        super.next(value);
        for (let i = 0; i < this.systems.length; ++i) {
            this.systems[i](value);
        }
        this.reflect$.next(value);
        for (let i = 0; i < this.renders.length; ++i) {
            this.renders[i](value);
        }
    }

}
