import { BehaviorSubject, combineLatest, from, map, switchMap, tap } from "rxjs";
import { Stream } from "xstream";

export const makeGame = (sinks: Stream<any>, state$: BehaviorSubject<any>) => {
    return from(sinks as any).pipe(
        switchMap((features: any) => {
            const keys = Object.keys(features).sort();
            return combineLatest(keys.map((k) => features[k])).pipe(
                map((slices: object[]) => keys.map((k, i) => ({ [k]: slices[i] }))
                    .reduce((state, slice) => Object.assign(state, slice), {})
                ),
                tap((state) => state$.next(state))
            )
        })
    )
};
