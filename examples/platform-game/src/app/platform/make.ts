import { b2BodyType, b2World } from "@box2d/core";
import { makeShape } from "../shape/make";

export function makeCreatePlatform(world: b2World, scale: number) {
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
    }, world, scale);
}
