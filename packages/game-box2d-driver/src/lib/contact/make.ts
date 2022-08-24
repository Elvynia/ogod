import { b2Contact } from '@box2d/core';
import { Subject } from 'rxjs';
import { Contact } from './state';

export function makeBox2dContactListener(contact$: Subject<Contact>) {
    return {
        BeginContact(contact: b2Contact) {
            const idA = contact.GetFixtureA().GetBody().GetUserData();
            const idB = contact.GetFixtureB().GetBody().GetUserData();
            contact$.next({
                idA,
                idB,
                touching: true
            });
        },
        EndContact(contact: b2Contact) {
            const idA = contact.GetFixtureA().GetBody().GetUserData();
            const idB = contact.GetFixtureB().GetBody().GetUserData();
            contact$.next({
                idA,
                idB,
                touching: false
            });
        },
        PreSolve() { },
        PostSolve() { }
    };
}
