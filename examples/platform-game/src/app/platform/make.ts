import { b2BodyType, b2World } from "@box2d/core";
import { makeShape } from "../shape/make";
import { AppSize } from "../state";

export function makeCreatePlatform(world: b2World, app: AppSize) {
    return (x: number, y: number, width: number = 600, height: number = 20, angle: number = 0) => makeShape({
        color: '#B244A5',
        id: undefined,
        x,
        y,
        width,
        height,
        angle,
        type: 'rect',
        bodyType: b2BodyType.b2_staticBody
    }, world, app);
}
