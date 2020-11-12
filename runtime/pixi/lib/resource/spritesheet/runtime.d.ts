import { OgodRuntimeResourceDefault } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { OgodStateEngine, OgodActionResource } from '@ogod/common';
import { PixiStateSpritesheet } from './state';
export declare class PixiRuntimeSpritesheet extends OgodRuntimeResourceDefault {
    initialize(state: PixiStateSpritesheet, state$: Observable<OgodStateEngine>): Observable<OgodActionResource>;
    getImageUrl(path: string, name: string): string;
}
