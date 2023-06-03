import { UpdateState } from "@ogod/core";
import { Observable, Subject, Subscription } from "rxjs";
import { makeUpdate$ } from "../update/make";

export type EngineFn<U = UpdateState> = (update: U) => void;

export interface PrePostSystems<U = UpdateState> {
    pre: EngineFn<U>[];
    post: EngineFn<U>[];
}

export interface EngineSubject<U = UpdateState> extends Subject<U> {
    renders: EngineFn<U>[];
    systems: PrePostSystems<U>;
    readonly reflect$: Subject<U>;
}

export class EngineSubjectDefault<U = UpdateState> extends Subject<U> implements EngineSubject<U> {
    readonly reflect$: Subject<U>;
    renders: EngineFn<U>[];
    systems: PrePostSystems<U>;
    subscription: Subscription;

    constructor(update$: Observable<U> = makeUpdate$() as Observable<U>) {
        super();
        this.reflect$ = new Subject();
        this.renders = [];
        this.systems = {
            pre: [],
            post: []
        };
        this.subscription = update$.subscribe(this);
    }

    override next(value: U): void {
        try {
            for (let i = 0; i < this.systems.pre.length; ++i) {
                this.systems.pre[i](value);
            }
            super.next(value);
            for (let i = 0; i < this.systems.post.length; ++i) {
                this.systems.post[i](value);
            }
            this.reflect$.next(value);
            for (let i = 0; i < this.renders.length; ++i) {
                this.renders[i](value);
            }
        } catch (e) {
            this.error(e);
        }
    }

    override complete(): void {
        this.subscription.unsubscribe();
        super.complete();
    }

}