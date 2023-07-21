import { FeatureKey, makeStateObject } from "@ogod/driver-engine";
import { easeOutCubic } from "@ogod/examples-common";
import { first, map } from "rxjs";
import { createNoise2D } from "simplex-noise";
import { WorkerSources } from "../../state";
import { MapState } from "../state";
import { makePlatformCreator } from "./creator";
import { generatePlatforms } from "./generate";

const DifficultyMax = 50;

export function makeFeatureMapPlatform(sources: WorkerSources): FeatureKey<MapState, 'platforms'> {
    const noise = createNoise2D();
    return {
        key: 'platforms',
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.Engine.state$.pipe(
                first(),
                map(({ map: mapState, camera }) => {
                    const makePlatform = makePlatformCreator(camera, sources.World);
                    mapState.platformWidth = 100 - (80 * easeOutCubic(Math.min(DifficultyMax, mapState.level) / DifficultyMax));
                    return {
                        publishOnNext: true,
                        value$: generatePlatforms(sources, mapState, noise, makePlatform)
                    }
                })
            ),
            state: {}
        })
    }
}
