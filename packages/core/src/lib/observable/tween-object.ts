import { Observable, map } from "rxjs";
import { EaseFn, animate } from "../operator/animate";
import { UpdateState } from "../update";
import { fromTo } from "./tween";

export interface TweenValueAbstract<T> {
    value?: T;
    valueFn?: (d: number) => T;
    easeFn?: EaseFn;
}

export interface TweenValue<T> extends TweenValueAbstract<T> {
    value: T;
}

export interface TweenValueFn<T> extends TweenValueAbstract<T> {
    valueFn: (d: number) => T;
}

export type TweenTarget<T> = TweenValue<T> | TweenValueFn<T>;

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
    const target = {} as Record<keyof T, (d: number) => T[Extract<keyof T, string>]>;
    const origin = {} as Record<keyof T, number>;
    const eases = {} as Record<keyof T, EaseFn>;
    for (const k in params.target) {
        origin[k] = params.source[k] as number;
        eases[k] = (params.target[k].easeFn || params.easeFn)!;
        target[k] = params.target[k].valueFn
            || ((d: number) => fromTo(eases[k](d), origin[k], params.target[k].value as number) as T[typeof k]);
    }
    return new Observable((subscriber) => {
        const sub = params.update$.pipe(
            animate(params.duration),
            map((d) => {
                for (const k in target) {
                    params.source[k] = target[k](d);
                }
                return params.source;
            })
        ).subscribe({
            complete: () => subscriber.complete()
        });
        return () => sub.unsubscribe();
    });
}
