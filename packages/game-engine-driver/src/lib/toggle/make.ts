import { GameEngineSource } from '@ogod/game-engine-driver';
import { first, map, Observable, startWith, switchMap } from 'rxjs';

export function makeFeatureToggle(engine: GameEngineSource<any>, key: string, action$: Observable<any>, defaultValue: boolean = false) {
    return action$.pipe(
        switchMap(() => engine.state$.pipe(
            first(),
            map((state) => !state[key]),
        )),
        startWith(defaultValue)
    );
}
