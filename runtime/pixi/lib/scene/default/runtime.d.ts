import { Observable } from 'rxjs';
import { OgodRuntimeSceneDefault } from '@ogod/runtime-core';
import { PixiStateScene } from './state';
import { OgodStateEngine, OgodActionScene } from '@ogod/common';
import { PixiStateInstance } from '../../instance/default/state';
export declare class PixiRuntimeScene extends OgodRuntimeSceneDefault {
    initialize(state: PixiStateScene, state$: Observable<OgodStateEngine>): Observable<OgodActionScene>;
    nextCanvas(state: PixiStateScene, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Partial<PixiStateScene>;
    add(state: PixiStateScene, child: PixiStateInstance): void;
    remove(state: PixiStateScene, id: string, child: PixiStateInstance): void;
    render(state: PixiStateScene): void;
}
