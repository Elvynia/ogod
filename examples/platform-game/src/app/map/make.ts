import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, concatMap, delay, first, ignoreElements, map, of, range, switchMap, tap, timer } from 'rxjs';
import { createNoise2D } from 'simplex-noise';
import { Loading, LoadingState } from '../loading/state';
import { makeCreatePlatform } from '../platform/make';
import { AppState, WorkerSources } from '../state';
import { MapState } from './state';

export function makeFeatureLoadMap(sources: WorkerSources, target: AppState) {
    const loading = {
        progress: 0,
        message: 'Generating map platforms !'
    } as Loading;
    const noise = createNoise2D();
    return makeFeature$({
        key: 'loading',
        value$: concat(
            sources.GameEngine.state$.pipe(
                first(),
                map((state) => state.gmap),
                switchMap((gmap: MapState) => {
                    if(Object.keys(gmap.platforms).length) {
                        Object.values(gmap.platforms).forEach((p) => sources.World.instance.DestroyBody(p.body))
                        gmap.platforms = {};
                    }
                    const makePlatform = makeCreatePlatform(sources.World.instance, gmap.scale)
                    return range(0, gmap.width).pipe(
                        concatMap((i) => of(i).pipe(
                            tap((x) => {
                                let y = 0;
                                while (y < gmap.height) {
                                    const value = noise(x, y);
                                    if (value > 0) {
                                        const p = makePlatform(x * gmap.mapScale, y * gmap.mapScale, 50, 10);
                                        gmap.platforms[p.id] = p;
                                    }
                                    ++y;
                                }
                            }),
                            map((i) => ({ ...loading, progress: i / 100 })),
                            delay(30)
                        ))
                    )
                })
            ),
            of({ ...loading, progress: 1 }),
            // timer(16).pipe(ignoreElements())
        ).pipe(
            map((l) => ({ map: l } as LoadingState))
        ),
        target,
        remove: true
    });
}
