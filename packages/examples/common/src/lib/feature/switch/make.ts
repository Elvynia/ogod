import { FeatureKey } from '@ogod/driver-engine';
import { Observable, map, withLatestFrom } from 'rxjs';

export function makeFeatureSwitch<K extends string>(params: {
    key: K,
    state$: Observable<Record<K, boolean>>,
    action$: Observable<boolean>
}): FeatureKey<Record<K, boolean>, K> {
    return {
        key: params.key,
        publishOnCreate: true,
        publishOnNext: true,
        value$: params.action$.pipe(
            withLatestFrom(params.state$.pipe(
                map((s) => s[params.key])
            )),
            map(([_, paused]) => !paused)
        ),
        value: false
    };
}
