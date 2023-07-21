import { tweenObject } from '@ogod/core';
import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { Circle, easeOutCubic, easeOutElastic, makeRandColor, makeRandNum } from '@ogod/examples-common';
import { filter, first, map, mergeMap, range, switchMap, tap } from 'rxjs';
import { PHASE } from './phase/state';
import { AppState, WorkerSources } from './state';

export type SplashState = Record<string, Circle>;

export function makeFeatureSplash(sources: WorkerSources): FeatureKey<AppState, 'splash'> {
    return {
        key: 'splash',
        publishOnComplete: true,
        publishOnCreate: true,
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.Engine.state$.pipe(
                filter((s) => s.splash && s.phase === PHASE.SPLASH),
                first(),
                switchMap((state) => {
                    return range(0, (state.camera.width + 100) / 100).pipe(
                        mergeMap((x) => range(0, (state.camera.height + 100) / 100).pipe(
                            map((y) => {
                                const source = {
                                    id: makeRandNum().toString(),
                                    x: state.camera.width / 2,
                                    y: state.camera.height / 2,
                                    radius: 5,
                                    color: makeRandColor()
                                };
                                return {
                                    key: source.id,
                                    publishOnCreate: true,
                                    publishOnComplete: true,
                                    value$: tweenObject({
                                        source,
                                        duration: 2000,
                                        easeFn: easeOutElastic,
                                        target: {
                                            x: { value: x * 100 },
                                            y: { value: y * 100 },
                                            radius: {
                                                value: 150,
                                                easeFn: easeOutCubic
                                            }
                                        },
                                        update$: sources.Engine.engine$
                                    }),
                                    value: source
                                } as FeatureKey<SplashState, string>
                            })
                        ))
                    )
                })
            ),
            state: {} as SplashState
        }).pipe(
            tap({
                complete: () => sources.Engine.action$.getHandler('phase').next(PHASE.START)
            })
        ),
        value: {}
    };
}
