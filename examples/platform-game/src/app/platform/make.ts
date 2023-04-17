import { b2BodyType } from "@box2d/core";
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { makeShape } from "../shape/make";

export function makeCreatePlatform(gameWorld: GameBox2dSource) {
    return (x: number, y: number, width: number = 400, height: number = 10, angle: number = 0) => makeShape({
        color: '#B244A5',
        id: undefined,
        x,
        y,
        width,
        height,
        angle,
        type: 'rect',
        bodyType: b2BodyType.b2_staticBody
    }, gameWorld);
}
