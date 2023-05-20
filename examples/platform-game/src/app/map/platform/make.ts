import { b2BodyType } from "@box2d/core";
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { FeatureKey, makeFeatureObject$ } from "@ogod/game-engine-driver";
import { EMPTY, concatMap, delay, first, map, of, range, tap } from "rxjs";
import { createNoise2D } from "simplex-noise";
import { makeShape } from "../../shape/make";
import { WorkerSources } from "../../state";
import { MapState } from "../state";
import { PlatformState } from "./state";

export function makeCreatePlatform(gameWorld: GameBox2dSource) {
    return (x: number, y: number, width: number = 400, height: number = 10, angle: number = 0) => makeShape({
        color: '#B244A5',
        id: undefined,
        x,
        y,
        width,
        height,
        angle,
        type: 'rect',
        bodyType: b2BodyType.b2_staticBody
    }, gameWorld);
}

export function makeFeatureMapPlatform(sources: WorkerSources): FeatureKey<MapState, 'platforms'> {
    const makePlatform = makeCreatePlatform(sources.World);
    const noise = createNoise2D();
    return {
        key: 'platforms',
        publishOnNext: true,
        value$: makeFeatureObject$({
            key$: sources.GameEngine.state$.pipe(
                first(),
                map(({ map: mapState }) => ({
                    publishOnNext: true,
                    value$: range(0, mapState.width + 1).pipe(
                        concatMap((x) => {
                            const platforms: PlatformState = {};
                            let y = 0;
                            while (y < mapState.height) {
                                const value = noise(x, y);
                                if (value > 0) {
                                    const p = makePlatform(x * mapState.scale, y * mapState.scale, 80, 10);
                                    platforms[p.id] = p;
                                }
                                ++y;
                            }
                            return of(platforms).pipe(
                                delay(50),
                                tap(() => sources.GameEngine.action$.getHandler('loading').next({
                                    key: 'map',
                                    publishOnCreate: true,
                                    publishOnComplete: Math.round(x * 100 / mapState.width) === 100,
                                    value$: EMPTY,
                                    value: {
                                        message: 'Generating map platforms !',
                                        progress: Math.round(x * 100 / mapState.width)
                                    }
                                }))
                            );
                        })
                    )
                }))
            ),
            state$: of({})
        })
    }
}
