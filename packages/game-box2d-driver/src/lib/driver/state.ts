import { Subject } from 'rxjs';
import { b2World } from '@box2d/core';
import { Contact } from '../contact/state';

export interface GameBox2DSource {
    contact$: Subject<Contact>;
    dispose: Function;
    instance: b2World;
}
