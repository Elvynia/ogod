import { map } from 'rxjs';
import { makeFeature$ } from "@ogod/game-engine-driver";
import { AppState, WorkerSources } from "../state";
import { createNoise2D } from 'simplex-noise';
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
        value$: sources.GameEngine.actions.generator.pipe(
            map((genType) => generators[genType])
        ),
        target
    })
}
