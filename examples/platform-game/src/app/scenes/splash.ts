import { timer, map } from 'rxjs';
import { Feature } from '@ogod/game-core';
import { makeFeatureConstant, makeFeatureObservable } from '@ogod/game-engine-driver';

export function makeSplashScene(): Feature[] {
    const splash = {
        logos: [
            'M505,55c0-27.6-22.4-50-50-50s-50,22.4-50,50c0-27.6-22.4-50-50-50s-50,22.4-50,50c0-27.6-22.4-50-50-50s-50,22.4-50,50 c0-27.6-22.4-50-50-50s-50,22.4-50,50c0-27.6-22.4-50-50-50S5,27.4,5,55'
        ]
    };
    return [
        makeFeatureObservable('splash', timer(1000).pipe(
            map(() => null)
        ), splash)
    ]
}
