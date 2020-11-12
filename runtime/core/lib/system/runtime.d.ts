import { OgodStateEngine, OgodStateSystem, OgodActionSystem, OgodStateInstance } from '@ogod/common';
import { Observable } from 'rxjs';
import { OgodRuntimeContainer } from '../container/runtime';
export interface OgodRuntimeSystem extends OgodRuntimeContainer<OgodStateSystem, OgodActionSystem> {
}
export declare function ogodAspectAny(aspects: any): (instance: OgodStateInstance) => boolean;
export declare function ogodAspectAll(aspects: any): (instance: OgodStateInstance) => boolean;
export declare class OgodRuntimeSystemDefault implements OgodRuntimeSystem {
    initialize(state: OgodStateSystem, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem>;
    start(state: OgodStateSystem, state$: Observable<OgodStateEngine>): void;
    add(state: OgodStateSystem, child: OgodStateInstance): void;
    changes(changes: Partial<OgodStateSystem>, state: OgodStateSystem): Observable<OgodActionSystem>;
    remove(state: OgodStateSystem, id: string, child: OgodStateInstance): void;
    stop(state: OgodStateSystem): void;
    destroy({ id }: OgodStateSystem): Observable<OgodActionSystem>;
    protected filter(state: OgodStateSystem, instances: Array<OgodStateInstance>): Array<OgodStateInstance>;
}
