import { b2World, XY } from '@box2d/core';
import { Driver } from '@ogod/game-core';
import { Observable, Subject } from 'rxjs';
import { Contact } from '../contact/state';

export interface GameBox2dSource<C extends Contact = Contact> {
    contact$: Subject<C>;
    dispose: Function;
    instance: b2World;
    scale: number;
}

export interface GameBox2dSink {
    update$: Observable<number>;
    gravity$?: Observable<XY>;
    // contact$: Observable<Contact>;
}

export type GameBox2dDriver = Driver<GameBox2dSource, GameBox2dSink>;
