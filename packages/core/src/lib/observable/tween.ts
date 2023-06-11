import { Observable, map } from "rxjs";
import { UpdateState } from "../update";
import { EaseFn, animate } from "../operator/animate";

export const fromTo = (d: number, source: number, target: number) => source + (target - source) * d;

export function tween(params: {
    source: number,
    duration: number,
    target: number,
    easeFn: EaseFn,
    update$: Observable<UpdateState>
}): Observable<number> {
    return new Observable((subscriber) => {
        const sub = params.update$.pipe(
            animate(params.duration),
            map((d) => fromTo(params.easeFn(d), params.source, params.target))
        ).subscribe({
            complete: () => subscriber.complete()
        });
        return () => sub.unsubscribe();
    });
}
