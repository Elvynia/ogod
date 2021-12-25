import { OgodRuntimeResourceDefault, ogodFetch } from '@ogod/runtime-core';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from "rxjs/operators";
import { OgodStateEngine, OgodActionResource } from '@ogod/common';
import { PixiStateSpritesheet } from './state';
import { fetchBaseTexture } from '../default/runtime';
import { Spritesheet } from 'pixi.js';

export class PixiRuntimeSpritesheet extends OgodRuntimeResourceDefault {

    initialize(state: PixiStateSpritesheet, state$: Observable<OgodStateEngine>): Observable<OgodActionResource> {
        return from(ogodFetch(state.path)).pipe(
            switchMap((response) => response.json()),
            switchMap((data) => fetchBaseTexture(this.getImageUrl(state.path, data.meta.image)).pipe(
                map((base) => new Spritesheet(base, data)),
                switchMap((sheet) => new Observable((observer) => {
                    sheet.parse(() => {
                        observer.next(sheet);
                        observer.complete();
                    });
                })),
                map((sheet) => ({
                    ...state,
                    data$: sheet
                }))
            )),
            switchMap((initState) => super.initialize(initState, state$))
        );
    }

    getImageUrl(path: string, name: string) {
        return path.substring(0, path.lastIndexOf('/') + 1) + name;
    }
}
