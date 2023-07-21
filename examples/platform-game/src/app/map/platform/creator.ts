import { b2BodyType } from "@box2d/core";
import { Box2dSource } from "@ogod/driver-box2d";
import { Camera } from "../../camera/state";
import { makeShape } from "../../shape/make";

export function makePlatformCreator(camera: Camera, world: Box2dSource) {
    return (worldX: number, worldY: number, width: number, id?: string) => makeShape({
        color: '#B244A5',
        id,
        width,
        height: 10,
        angle: 0,
        bodyType: b2BodyType.b2_staticBody,
        type: 'rect',
        opacity: 1,
        worldX,
        worldY
    }, camera, world);
}
