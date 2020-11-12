import { OgodActionInstance, OgodStateEngine, OgodStateInstance } from "@ogod/common";
import { Observable } from "rxjs";
import { OgodRuntimeReactive } from "../reactive/runtime";
export interface OgodRuntimeInstance extends OgodRuntimeReactive<OgodStateInstance, OgodActionInstance> {
}
export declare abstract class OgodRuntimeInstanceDefault implements OgodRuntimeInstance {
    initialize(state: OgodStateInstance, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance>;
    start(state: OgodStateInstance, state$: Observable<OgodStateEngine>): void;
    changes(changes: Partial<OgodStateInstance>, state: OgodStateInstance): Observable<OgodActionInstance>;
    stop(state: OgodStateInstance): void;
    destroy({ id }: OgodStateInstance): Observable<OgodActionInstance>;
}
