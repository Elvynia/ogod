import { OgodRuntimeResourceDefault } from '@ogod/runtime-core';
import { PixiStateTextures } from "./state";
import { OgodActionResource, OgodStateEngine } from "@ogod/common";
import { forkJoin, Observable } from 'rxjs';
import { fetchBaseTexture } from '../default/runtime';
import { map, switchMap } from 'rxjs/operators';

export class PixiRuntimeTextures extends OgodRuntimeResourceDefault {

    initialize(state: PixiStateTextures, state$: Observable<OgodStateEngine>): Observable<OgodActionResource> {
        return forkJoin(
            state.paths.map((path) => fetchBaseTexture(path))
        ).pipe(
            map((textures) => ({
                ...state,
                data$: textures.map((base) => new PIXI.Texture(base))
            })),
            switchMap((initState) => super.initialize(initState, state$))
        );
    }
}
