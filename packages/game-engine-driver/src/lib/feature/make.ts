import { FeatureState, RuntimeState } from '@ogod/game-core';
import { combineLatest, concatMap, from, map, Observable, ReplaySubject } from 'rxjs';

export function makeFeature<F extends FeatureState>(runtime$: Observable<RuntimeState<F>>) {
    const subject = new ReplaySubject<F>(1);
    from(runtime$).pipe(
        concatMap((runtime) => {
            const obsKeys = Object.keys(runtime)
                .filter((k) => k.endsWith('$'));
            const constants = Object.keys(runtime)
                .filter((k) => !k.endsWith('$'))
                .reduce((a, b) => Object.assign(a, { [b]: runtime[b] }), {});
            return combineLatest(obsKeys.map((k) => runtime[k] as Observable<typeof runtime[typeof k]>)).pipe(
                map((slices) => obsKeys.map((k, i) => ({ [k.replace('$', '')]: slices[i] }))
                    .reduce((state, slice) => Object.assign(state, slice), { ...constants } as F)
                )
            )
        })
    ).subscribe(subject);
    return subject;
}
