import { b2ContactListener, b2Contact } from '@flyover/box2d';
import { OgodRuntimeSystemDefault } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { OgodStateEngine, OgodActionSystem } from '@ogod/common';
import { Box2dStateJump } from './state';
import { Box2dStateBodyJump } from '../../instance/jump/state';
export declare class JumpContactListener extends b2ContactListener {
    BeginContact(contact: b2Contact): void;
    EndContact(contact: b2Contact): void;
}
export declare class Box2dRuntimeJump extends OgodRuntimeSystemDefault {
    initialize(state: Box2dStateJump, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem>;
    add(state: Box2dStateJump, instance: Box2dStateBodyJump): void;
    remove(state: Box2dStateJump, id: string, instance: Box2dStateBodyJump): void;
}
