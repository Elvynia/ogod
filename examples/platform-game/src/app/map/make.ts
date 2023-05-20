import { FeatureKey, makeFeatureObject$ } from '@ogod/game-engine-driver';
import { distinctUntilKeyChanged, filter, first, map, of } from 'rxjs';
import { PHASE } from '../phase/state';
import { AppState, WorkerSources } from '../state';
import { makeFeatureMapGravity } from './gravity/make';
import { makeFeatureMapPlatform } from './platform/make';

function selectMap$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        map((s) => s.map),
        first()
    );
}

export function makeFeatureMapInit(sources: WorkerSources): FeatureKey<AppState, 'map'> {
    return {
        key: 'map',
        publishOnCreate: true,
        value$: makeFeatureObject$({
            key$: of(
                makeFeatureMapGravity(sources)
            ),
            state$: selectMap$(sources)
        }),
        value: {
            platforms: {},
            width: 20,
            height: 5,
            gravity: -10,
            scale: 100,
            level: 0
        }
    }
}

export function makeFeatureMapLoad(sources: WorkerSources): FeatureKey<AppState, 'map'> {
    return {
        key: 'map',
        publishOnNext: true,
        value$: makeFeatureObject$({
            key$: of(
                makeFeatureMapPlatform(sources)
            ),
            state$: selectMap$(sources)
        })
    }
}

export function makeFeatureMapNext(sources: WorkerSources): FeatureKey<AppState, 'map'> {
    return {
        key: 'map',
        value$: sources.GameEngine.state$.pipe(
            distinctUntilKeyChanged('phase'),
            filter((s) => s.phase === PHASE.END),
            first(),
            map((state) => {
                Object.values(state.map.platforms).forEach((p) => sources.World.instance.DestroyBody(p.body))
                sources.World.instance.DestroyBody(state.shapes.player.body);
                state.map.platforms = {};
                state.map.width += 5;
                ++state.map.level;
                return state.map;
            })
        ),
    }
}