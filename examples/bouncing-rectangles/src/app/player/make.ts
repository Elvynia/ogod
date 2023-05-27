import { FeatureKey, makeStateObject } from '@ogod/game-engine-driver';
import { of, switchMap } from 'rxjs';
import { waitForCamera } from '../camera/make';
import { makeRect } from '../rect/make';
import { AppState, WorkerSources } from "../state";

export function makeFeaturePlayer(sources: WorkerSources): FeatureKey<AppState, 'player'> {
    return {
        key: 'player',
        value$: waitForCamera(sources).pipe(
            switchMap((state) => {
                return makeStateObject({
                    key$: of({
                        key: 'color' as const,
                        publishOnNext: true,
                        value$: sources.GameEngine.action$.getHandler('playerColor')
                    }),
                    state: makeRect({
                        x: 400,
                        y: 400,
                        width: 15,
                        height: 25,
                        dynamic: true
                    }, sources.World.instance, state.camera.scale)
                })
            })
        )
    }
}
