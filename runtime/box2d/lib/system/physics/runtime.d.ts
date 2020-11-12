import { OgodRuntimeSystemDefault } from '@ogod/runtime-core';
import { Box2dStatePhysics } from './state';
import { OgodStateEngine, OgodActionSystem } from '@ogod/common';
import { Observable } from 'rxjs';
export declare const WORLD_RATIO = 10;
export declare const WORLD_STEP: number;
export declare class Box2dRuntimePhysics extends OgodRuntimeSystemDefault {
    time: number;
    initialize(state: Box2dStatePhysics, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem>;
    add(state: Box2dStatePhysics, instance: any): void;
    remove(state: Box2dStatePhysics, id: string, instance: any): void;
    update(delta: number, state: Box2dStatePhysics): void;
    destroy(state: Box2dStatePhysics): Observable<OgodActionSystem>;
    refreshModifiers(state: Box2dStatePhysics): void;
}
