import { EMPTY, concatMap, delay, first, ignoreElements, of, range, skip, tap } from "rxjs";
import { NoiseFunction2D } from "simplex-noise";
import { WorkerSources } from "../../state";
import { MapState } from "../state";
import { makePlatformCreator } from "./creator";

export const PlatformStartId = 'start';

export function generatePlatforms(
    sources: WorkerSources,
    mapState: MapState,
    noise: NoiseFunction2D,
    makePlatform: ReturnType<typeof makePlatformCreator>) {
    let lastHeight = mapState.height / 2;
    let width = 0;
    return range(0, mapState.size + 1).pipe(
        concatMap((i) => {
            const angle = noise(i, 0) * Math.PI;
            const y = Math.sin(angle)
            lastHeight += y * 200;
            let p;
            if (i === 0) {
                p = makePlatform(0, lastHeight, mapState.platformWidth, PlatformStartId);
            } else {
                const x = mapState.scale - mapState.scale * y / 2;
                p = makePlatform(width + x, lastHeight, mapState.platformWidth);
                width += x + mapState.platformWidth / 2;
            }
            return of({ [p.id]: p }).pipe(
                delay(50),
                tap(() => {
                    const progress = Math.round(i * 100 / mapState.size);
                    const publishOnComplete = progress === 100;
                    if (publishOnComplete) {
                        mapState.width = width;
                    }
                    return sources.Engine.action$.getHandler('loading').next({
                        key: 'map',
                        publishOnCreate: true,
                        publishOnComplete,
                        value$: publishOnComplete
                            ? sources.Engine.engine$.pipe(
                                skip(1),
                                first(),
                                ignoreElements()
                            )
                            : EMPTY,
                        value: {
                            message: 'Generating map platforms !',
                            progress
                        }
                    })
                })
            );
        })
    )
}
