import { Observable } from 'rxjs';
import { OgodRuntimeResourceDefault } from "@ogod/runtime-core";
import { fetchBaseTexture } from '../default/runtime';
import { map, switchMap } from 'rxjs/operators';
import { PixiStateTexture } from './state';
import { OgodStateEngine, OgodActionResource } from '@ogod/common';
import { Texture } from 'pixi.js';

export class PixiRuntimeTexture extends OgodRuntimeResourceDefault {

    initialize(state: PixiStateTexture, state$: Observable<OgodStateEngine>): Observable<OgodActionResource> {
        return fetchBaseTexture(state.path).pipe(
            map((base) => new Texture(base)),
            map((texture) => ({
                ...state,
                data$: texture
            })),
            switchMap((initState) => super.initialize(initState, state$))
        );
    }
}
