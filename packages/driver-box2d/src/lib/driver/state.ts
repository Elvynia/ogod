import { b2World, XY } from '@box2d/core';
import { Driver } from '@ogod/core';
import { Observable, Subject } from 'rxjs';
import { Contact } from '../contact/state';

export interface Box2dSource<C extends Contact = Contact> {
    contact$: Subject<C>;
    dispose: Function;
    instance: b2World;
    scale: number;
}

export interface Box2dSink {
    update$: Observable<number>;
    gravity$?: Observable<XY>;
    // contact$: Observable<Contact>;
}

export type DriverBox2d = Driver<Box2dSource, Box2dSink>;
