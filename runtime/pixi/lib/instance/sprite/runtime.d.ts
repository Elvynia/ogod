import { PixiRuntimeInstance } from "../default/runtime";
import { OgodStateEngine } from "@ogod/common";
import { Observable } from "rxjs";
import { PixiStateSprite } from "./state";
export declare class PixiRuntimeSprite extends PixiRuntimeInstance {
    initializeSprite(state: PixiStateSprite, state$: Observable<OgodStateEngine>): Observable<PixiStateSprite>;
    initializeProperties(state: PixiStateSprite): void;
    updateStateAnchor(_: any, state: PixiStateSprite): void;
    updateStateAnchorX(_: any, state: PixiStateSprite): void;
    updateStateAnchorY(_: any, state: PixiStateSprite): void;
}
