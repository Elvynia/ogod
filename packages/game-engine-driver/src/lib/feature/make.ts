import { RuntimeState } from '@ogod/game-engine-driver';
import { combineLatest, from, map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { FeatureState } from "./state";


export function makeFeature<F extends FeatureState>(runtime$: Observable<RuntimeState<F>>) {
    const subject = new ReplaySubject<F>(1);
    from(runtime$).pipe(
        switchMap((runtime) => {
            const keys = Object.keys(runtime).sort();
            return combineLatest(keys.map((k) => runtime[k])).pipe(
                map((slices) => keys.map((k, i) => ({ [k]: slices[i] }))
                    .reduce((state, slice) => Object.assign(state, slice), {} as F)
                )
            )
        })
    ).subscribe(subject);
    return subject;
}
