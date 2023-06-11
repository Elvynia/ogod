import { tweenObject } from '@ogod/core';
import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { filter, first, map, mergeMap, range, switchMap, tap } from 'rxjs';
import { PHASE } from '../phase/state';
import { AppState, WorkerSources } from '../state';
import { randColor, randNum } from '../util';
import { SplashState } from './state';

function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

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
                        mergeMap((x) => range(0, state.camera.height / 100).pipe(
                            map((y) => {
                                const source = {
                                    x: state.camera.width / 2,
                                    y: state.camera.height / 2,
                                    radius: 5,
                                    color: randColor()
                                };
                                return {
                                    key: randNum(8).toString(),
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
