import { OgodActionResource } from '@ogod/common';
import { OgodRuntimeResourceDefault } from '@ogod/runtime-core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageBitmapLoader } from 'three';
import { ThreeRuntimeEngine } from './../../engine/runtime';
import { ThreeStateEngine } from './../../engine/state';
import { ThreeStateTexture } from './state';

declare var self: ThreeRuntimeEngine;

export class ThreeRuntimeTexture extends OgodRuntimeResourceDefault {

    initialize(state: ThreeStateTexture, state$: Observable<ThreeStateEngine>): Observable<OgodActionResource> {
        const loader = new ImageBitmapLoader();
        return from(loader.loadAsync((self.baseHref + state.path).replace(/\/\//g, '/'))).pipe(
            switchMap((texture) => super.initialize({
                ...state,
                data$: texture
            } as ThreeStateTexture, state$))
        );
    }
}
