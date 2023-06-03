import { b2Contact } from '@box2d/core';
import { Subject } from 'rxjs';
import { Contact } from './state';

function getContactInfos(contact: b2Contact): Contact {
    return {
        dataA: contact.GetFixtureA().GetBody().GetUserData(),
        dataB: contact.GetFixtureB().GetBody().GetUserData(),
        sensorA: contact.GetFixtureA().IsSensor() ? contact.GetFixtureA().GetUserData() : undefined,
        sensorB: contact.GetFixtureB().IsSensor() ? contact.GetFixtureB().GetUserData() : undefined,
        touching: contact.IsTouching() ? 1 : -1
    };
}

export function makeBox2dContactListener(contact$: Subject<Contact>) {
    return {
        BeginContact(contact: b2Contact) {
            contact$.next(getContactInfos(contact));
        },
        EndContact(contact: b2Contact) {
            contact$.next(getContactInfos(contact));
        },
        PreSolve() { },
        PostSolve() { }
    };
}
