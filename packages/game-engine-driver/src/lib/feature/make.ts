import { Feature } from '@ogod/game-core';
import { concat, map, Observable, of, tap } from 'rxjs';

export function makeFeature$<S = any>(feature: Feature<S>): Observable<S> {
    const state = feature.target || {} as S;
    let f$ = feature.value$.pipe(
        map((value) => {
            state[feature.key] = value;
            return state;
        })
    );
    if (feature.remove) {
        f$ = concat(
            f$,
            of(state).pipe(
                tap(() => delete state[feature.key])
            )
        );
    }
    return f$;
}
