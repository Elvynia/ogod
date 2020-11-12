import { OgodRuntimeResourceDefault } from '@ogod/runtime-core';
import { PixiStateTextures } from "./state";
import { OgodActionResource, OgodStateEngine } from "@ogod/common";
import { Observable } from 'rxjs';
export declare class PixiRuntimeTextures extends OgodRuntimeResourceDefault {
    initialize(state: PixiStateTextures, state$: Observable<OgodStateEngine>): Observable<OgodActionResource>;
}
