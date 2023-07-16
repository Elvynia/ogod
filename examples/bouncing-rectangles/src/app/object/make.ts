import { b2BodyType, b2PolygonShape } from '@box2d/core';
import { Box2dSource } from '@ogod/driver-box2d';
import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { isColorLight, makeRandColor, makeRandInRange, makeRandNum } from '@ogod/examples-common';
import { BehaviorSubject, finalize, first, map, of, takeWhile } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { Box, ObjectState } from './state';

export function makeBox(box: Partial<Box>, world: Box2dSource): Box {
    const obj = {
        ...box,
        angle: box.angle || 0,
        color: box.color || makeRandColor(),
        id: box.id || makeRandNum().toString(),
        width: box.width || makeRandInRange(20, 50),
        height: box.height || makeRandInRange(20, 50)
    } as Box;
    obj.health = Math.round(obj.width * obj.height / 50);
    obj.body = world.instance.CreateBody({
        position: {
            x: obj.x / world.scale,
            y: obj.y / world.scale
        },
        linearVelocity: obj.dynamic ? {
            x: makeRandInRange(-8, 8),
            y: makeRandInRange(-8, 8)
        } : undefined,
        type: obj.dynamic ? b2BodyType.b2_dynamicBody : b2BodyType.b2_staticBody,
        angle: -obj.angle
    });
    obj.body.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(obj.width / (2 * world.scale), obj.height / (2 * world.scale)),
        density: 10,
        restitution: obj.dynamic ? 1.1 : 0.9
    });
    if (box.dynamic) {
        obj.colorLight = isColorLight(obj.color as string);
    }
    return obj;
}

export function makeFeatureObject(sources: WorkerSources, { x, y }): FeatureKey<ObjectState, string> {
    const obj = makeBox({
        angle: 0,
        dynamic: true,
        x,
        y: y,
    }, sources.World);
    const health$ = new BehaviorSubject(obj.health);
    obj.body.SetUserData(health$);
    return {
        key: obj.id,
        publishOnComplete: true,
        value$: makeStateObject({
            key$: of({
                key: 'health',
                value$: health$.pipe(
                    takeWhile((health) => health > 0),
                    finalize(() => sources.Engine.engine$.pipe(
                        first()
                    ).subscribe(() => sources.World.instance.DestroyBody(obj.body)))
                )
            }),
            publishOnCreate: true,
            state: obj
        })
    };
}

export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    return {
        key: 'objects',
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.Engine.action$.getHandler('objects').pipe(
                map((pos) => makeFeatureObject(sources, pos)),
            ),
            publishOnCreate: true,
            state: {} as ObjectState
        }),
    };
}
