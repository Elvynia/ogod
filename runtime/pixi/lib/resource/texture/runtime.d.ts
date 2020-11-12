import { Observable } from 'rxjs';
import { OgodRuntimeResourceDefault } from "@ogod/runtime-core";
import { PixiStateTexture } from './state';
import { OgodStateEngine, OgodActionResource } from '@ogod/common';
export declare class PixiRuntimeTexture extends OgodRuntimeResourceDefault {
    initialize(state: PixiStateTexture, state$: Observable<OgodStateEngine>): Observable<OgodActionResource>;
}
