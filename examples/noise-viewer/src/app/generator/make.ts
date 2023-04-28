import { makeFeature$ } from "@ogod/game-engine-driver";
import { map } from 'rxjs';
import { createNoise2D } from 'simplex-noise';
import { AppState, WorkerSources } from "../state";
import { GeneratorType } from './state';

export function makeGenerators(): Record<GeneratorType, () => (x: number, y: number) => number> {
    const constNoise = createNoise2D();
    return {
        'random': () => () => Math.random() * 2 - 1,
        'perlin': () => createNoise2D(),
        'perlin-constant': () => constNoise
    };
}

export function makeFeatureGenerator(sources: WorkerSources, target: AppState) {
    const generators = makeGenerators();
    return makeFeature$({
        key: 'generator',
        value$: sources.GameEngine.action$.getHandler('generator').pipe(
            map((genType) => generators[genType])
        ),
        target
    })
}
