import { RuntimeState } from '@ogod/game-engine-driver';
import { combineLatest, from, map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { FeatureState } from "./state";

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
    // subject.subscribe({
        // next: (value) => console.log('Next feature state: ', value),
        // complete: () => console.log('Feature complete ?')
    // })
    return subject;
}
