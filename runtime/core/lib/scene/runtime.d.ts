import { OgodActionScene, OgodStateEngine, OgodStateInstance, OgodStateScene } from '@ogod/common';
import { Observable } from 'rxjs';
import { OgodRuntimeContainer } from './../container/runtime';
export interface OgodRuntimeScene extends OgodRuntimeContainer<OgodStateScene, OgodActionScene> {
    nextCanvas(state: OgodStateScene, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Partial<OgodStateScene> | void;
    render(state: OgodStateScene): void;
}
export declare abstract class OgodRuntimeSceneDefault implements OgodRuntimeScene {
    initialize(state: OgodStateScene, state$: Observable<OgodStateEngine>): Observable<OgodActionScene>;
    abstract nextCanvas(state: OgodStateScene, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Partial<OgodStateScene> | void;
    abstract render(state: OgodStateScene): void;
    start(state: OgodStateScene, state$: Observable<OgodStateEngine>): void;
    add(state: OgodStateScene, child: OgodStateInstance): void;
    changes(changes: Partial<OgodStateScene>, state: OgodStateScene): Observable<OgodActionScene>;
    remove(state: OgodStateScene, id: string, child: OgodStateInstance): void;
    stop(state: OgodStateScene): void;
    destroy({ id }: OgodStateScene): Observable<OgodActionScene>;
}
