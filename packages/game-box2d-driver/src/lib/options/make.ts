import { b2World, XY } from '@box2d/core';
import { GameBox2dOptions } from './state';

export function makeGameBox2dOptions(gravity: XY = { x: 0, y: 0 }, contactListener: boolean = true) {
    return {
        contactListener,
        world: b2World.Create(gravity)
    } as GameBox2dOptions
}
