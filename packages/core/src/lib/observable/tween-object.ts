import { Observable, map } from "rxjs";
import { UpdateState } from "../update";
import { EaseFn, animate } from "../operator/animate";
import { fromTo } from "./tween";

export interface TweenValueAbstract<T> {
    value?: number;
    valueFn?: (d: number) => T;
    easeFn?: EaseFn;
}

export interface TweenValue extends TweenValueAbstract<number> {
    value: number;
}

export interface TweenValueFn<T> extends TweenValueAbstract<T> {
    valueFn: (d: number) => T;
}

export type TweenTarget<T> = TweenValue | TweenValueFn<T>;

export type TweenTargets<T extends object> = {
    [K in keyof Partial<T>]: TweenTarget<T[K]>;
};

export function tweenObject<T extends object>(params: {
    source: T,
    duration: number,
    target: TweenTargets<T>,
    easeFn?: (d: number) => number,
    update$: Observable<UpdateState>
}): Observable<T> {
    const target = {} as any;
    const origin = {} as any;
    const eases = {} as any;
    for (const k in params.target) {
        origin[k] = params.source[k as keyof T];
        eases[k] = params.target[k].easeFn || params.easeFn;
        target[k] = params.target[k].valueFn
            || ((d: number) => fromTo(eases[k](d), origin[k], params.target[k].value!))
    }
    return params.update$.pipe(
        animate(params.duration),
        map((d) => {
            for (const k in target) {
                params.source[k as keyof T] = target[k](d);
            }
            return params.source;
        })
    );
}
