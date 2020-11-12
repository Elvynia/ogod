import { OgodActionScene, OgodStateEngine } from '@ogod/common';
import { OgodRuntimeSceneDefault } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { D2StateScene } from './state';
export declare class D2RuntimeScene extends OgodRuntimeSceneDefault {
    initialize(state: D2StateScene, state$: Observable<OgodStateEngine>): Observable<OgodActionScene>;
    nextCanvas(state: D2StateScene, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Partial<D2StateScene>;
    render(state: D2StateScene): void;
}
