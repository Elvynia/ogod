import { instanceInit, OGOD_CATEGORY } from "@ogod/common";
import { WORLD_RATIO } from "@ogod/runtime-box2d";

export function generateGrounds(ww: Worker, sceneId: string, objects: any) {
    Object.entries(objects).map(([id, obj]: [string, any]) => ww.postMessage(instanceInit({
        id,
        state: {
            id,
            scenes: [sceneId],
            category: OGOD_CATEGORY.INSTANCE,
            runtime: 'rect',
            active: true,
            x: obj.x,
            y: obj.y,
            color: '#626c66',
            sizeX: obj.sizeX,
            sizeY: obj.sizeY,
            updates: [],
            reflects: [],
            tick: false,
            angle: obj.angle,
            body: {
                x: obj.x / WORLD_RATIO + obj.sizeX / (2 * WORLD_RATIO),
                y: obj.y / WORLD_RATIO + obj.sizeY / (2 * WORLD_RATIO),
                friction: 0.1,
                restitution: 0.2,
                shape: {
                    angle: obj.angle,
                    x: obj.sizeX / (2 * WORLD_RATIO),
                    y: obj.sizeY / (2 * WORLD_RATIO),
                }
            }
        } as any
    })));
}