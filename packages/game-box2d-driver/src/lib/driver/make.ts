import { b2World, XY } from '@box2d/core';
import { Subject, Subscription } from 'rxjs';
import { makeBox2dContactListener } from '../contact/make';
import { GameBox2dSink } from '../sink/state';
import { GameBox2dSource } from '../source/state';
import { Contact } from './../contact/state';

export function makeGameBox2dDriver(initalGravity: XY = { x: 0, y: 0 }) {
    let world = b2World.Create(initalGravity);
    const contact$ = new Subject<Contact>();
    const subs: Subscription[] = [];
    return (sink$: Promise<GameBox2dSink>): GameBox2dSource => {
        console.debug('[GameBox2d] Created');
        sink$.then((sink) => {
            subs.push(sink.update$.subscribe((delta: number) => {
                world.Step(delta / 1000, {
                    velocityIterations: 6,
                    positionIterations: 2
                });
            }));
            subs.push(sink.gravity$.subscribe((g) => world.SetGravity(g)));
            world.SetContactListener(makeBox2dContactListener(contact$));
            console.debug('[GameBox2d] Initialized');
        });
        return {
            contact$,
            dispose: () => {
                let body = world.GetBodyList();
                while (body) {
                    world?.DestroyBody(body);
                    body = body.GetNext();
                }
                contact$.complete();
                subs.forEach((s) => s.unsubscribe());
                console.debug('[GameBox2d] Disposed');
            },
            instance: world
        }
    }
}
