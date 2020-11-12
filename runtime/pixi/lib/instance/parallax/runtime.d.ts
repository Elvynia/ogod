import { Observable } from 'rxjs';
import { OgodStateEngine, OgodActionInstance } from '@ogod/common';
import { PixiRuntimeInstance } from '../default/runtime';
import { PixiStateParallax } from './state';
export declare class PixiRuntimeParallax extends PixiRuntimeInstance {
    initializeSprite(state: PixiStateParallax, state$: Observable<OgodStateEngine>): Observable<PixiStateParallax>;
    update(delta: number, state: PixiStateParallax): void;
    destroy(state: PixiStateParallax): Observable<OgodActionInstance>;
}
