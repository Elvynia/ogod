import { FeatureState, RuntimeState } from '@ogod/game-core';
import { combineLatest, from, map, Observable, ReplaySubject, switchMap } from 'rxjs';

export function makeFeature<F extends FeatureState>(runtime$: Observable<RuntimeState<F>>) {
    const subject = new ReplaySubject<F>(1);
    from(runtime$).pipe(
        switchMap((runtime) => {
            const obsKeys = Object.keys(runtime)
                .filter((k) => k.endsWith('$'));
            const constants = Object.keys(runtime)
                .filter((k) => !k.endsWith('$'))
                .reduce((a, b) => Object.assign(a, { [b]: runtime[b] }), {});
            return combineLatest(obsKeys.map((k) => runtime[k])).pipe(
                map((slices) => obsKeys.map((k, i) => ({ [k.replace('$', '')]: slices[i] }))
                    .reduce((state, slice) => Object.assign(state, slice), { ...constants } as F)
                )
            )
        })
    ).subscribe(subject);
    return subject;
}
