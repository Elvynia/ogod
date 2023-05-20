import { FeatureGroupObservable } from '@ogod/game-engine-driver';
import * as chroma from 'chroma-js';
import { map, startWith } from 'rxjs';
import { WorkerSources } from '../../state';
import { randColor } from '../../util';
import { Background } from '../state';

export type BackgroundColors = Pick<Background, 'baseColor' | 'colors'>;

export function makeBackgroundColors(color: string): BackgroundColors {
    const ch = chroma(color).lch();
    const colors = [color];
    for (let i = 0; i < 4; ++i) {
        ch[2] += 50;
        colors.push(chroma.lch(...ch).hex())
    }
    return {
        baseColor: color,
        colors: chroma.scale(colors)
            .mode('lch').colors(50)
    };
}

export function makeFeatureBackgroundColors(sources: WorkerSources): FeatureGroupObservable<Background, BackgroundColors> {
    return {
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('background').pipe(
            startWith(randColor()),
            map(makeBackgroundColors)
        )
    };
}