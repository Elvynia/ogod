import { Observable, Subject } from "rxjs";
import { makeUpdate$ } from "../update/make";
import { UpdateState } from "../update/state";

export type EngineFn<U = UpdateState> = (update: U) => void;

export class EngineSubject<U = UpdateState> extends Subject<U> {
    renders: EngineFn<U>[];
    systems: EngineFn<U>[];

    constructor(update$: Observable<U> = makeUpdate$() as Observable<U>) {
        super();
        this.renders = [];
        this.systems = [];
        update$.subscribe(this);
    }

    override next(value: U): void {
        super.next(value);
        for (let i = 0; i < this.systems.length; ++i) {
            this.systems[i](value);
        }
        for (let i = 0; i < this.renders.length; ++i) {
            this.renders[i](value);
        }
    }

}
