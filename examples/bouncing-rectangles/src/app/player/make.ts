import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { of } from 'rxjs';
import { makeBox } from '../object/make';
import { AppState, WorkerSources } from "../state";

export function makeFeaturePlayer(sources: WorkerSources): FeatureKey<AppState, 'player'> {
    return {
        key: 'player',
        value$: makeStateObject({
            key$: of({
                key: 'color' as const,
                publishOnNext: true,
                value$: sources.Engine.action$.getHandler('playerColor')
            }),
            state: makeBox({
                x: 400,
                y: 400,
                width: 15,
                height: 25,
                dynamic: true
            }, sources.World)
        })
    }
}
