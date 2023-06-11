import { b2World, XY } from '@box2d/core';
import { Subject, Subscription } from 'rxjs';
import { makeBox2dContactListener } from '../contact/make';
import { Contact } from './../contact/state';
import { Box2dSink, Box2dSource } from './state';

export function makeDriverBox2d(initalGravity: XY = { x: 0, y: 0 }, scale: number = 20) {
    let world = b2World.Create(initalGravity);
    const contact$ = new Subject<Contact>();
    const subs: Subscription[] = [];
    return (sink$: Promise<Box2dSink>): Box2dSource => {
        console.debug('[Box2d] Created');
        sink$.then((sink) => {
            subs.push(sink.update$.subscribe(({ delta }) => {
                world.Step(delta / 1000, {
                    velocityIterations: 6,
                    positionIterations: 2
                });
            }));
            if (sink.gravity$) {
                subs.push(sink.gravity$.subscribe((g) => world.SetGravity(g)));
            }
            world.SetContactListener(makeBox2dContactListener(contact$));
            console.debug('[Box2d] Initialized');
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
                console.debug('[Box2d] Disposed');
            },
            instance: world,
            scale
        }
    }
}
