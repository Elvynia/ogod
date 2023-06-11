import { UpdateState } from "@ogod/core";
import { Observable, Subject, Subscription } from "rxjs";
import { makeUpdate$ } from "../update/make";

export type EngineFn = (update: UpdateState) => void;

export interface PrePostSystems {
    pre: EngineFn[];
    post: EngineFn[];
}

export interface EngineSubject extends Subject<UpdateState> {
    renders: EngineFn[];
    systems: PrePostSystems;
    readonly reflect$: Subject<UpdateState>;
}

export class EngineSubjectDefault extends Subject<UpdateState> implements EngineSubject {
    readonly reflect$: Subject<UpdateState>;
    renders: EngineFn[];
    systems: PrePostSystems;
    subscription: Subscription;

    constructor(update$: Observable<UpdateState> = makeUpdate$()) {
        super();
        this.reflect$ = new Subject();
        this.renders = [];
        this.systems = {
            pre: [],
            post: []
        };
        this.subscription = update$.subscribe(this);
    }

    override next(value: UpdateState): void {
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
