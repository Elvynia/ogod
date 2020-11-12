import { PixiStateResource } from './../../resource/default/state';
import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { PixiStateInstance } from './state';
import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
export declare function waitForResource<T extends PixiStateResource>(state: PixiStateInstance, state$: Observable<OgodStateEngine>): Observable<T['data$']>;
export declare abstract class PixiRuntimeInstance extends OgodRuntimeInstanceDefault {
    initialize(state: PixiStateInstance, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance>;
    abstract initializeSprite(state: PixiStateInstance, state$: Observable<OgodStateEngine>): Observable<PixiStateInstance>;
    initializeProperties(state: PixiStateInstance): void;
    updateStateX(_: any, state: PixiStateInstance): void;
    updateStateY(_: any, state: PixiStateInstance): void;
    updateStateRotation(_: any, state: PixiStateInstance): void;
    updateStateScale(_: any, state: PixiStateInstance): void;
    updateStateScaleX(_: any, state: PixiStateInstance): void;
    updateStateScaleY(_: any, state: PixiStateInstance): void;
    updateStateIndex(_: any, state: PixiStateInstance): void;
    destroy(state: PixiStateInstance): Observable<OgodActionInstance>;
}
