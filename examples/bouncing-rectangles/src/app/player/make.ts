import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { first, of, switchMap } from 'rxjs';
import { makeRect } from '../rect/make';
import { AppState, WorkerSources } from "../state";

export function makeFeaturePlayer(sources: WorkerSources): FeatureKey<AppState, 'player'> {
    return {
        key: 'player',
        value$: sources.Engine.state$.pipe(
            first(),
            switchMap((state) => {
                return makeStateObject({
                    key$: of({
                        key: 'color' as const,
                        publishOnNext: true,
                        value$: sources.Engine.action$.getHandler('playerColor')
                    }),
                    state: makeRect({
                        x: 400,
                        y: 400,
                        width: 15,
                        height: 25,
                        dynamic: true
                    }, sources.World.instance, state.scale)
                })
            })
        )
    }
}
