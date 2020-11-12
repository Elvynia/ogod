import { OgodElementSystem } from "@ogod/element-core";
export interface Box2dElementJump extends OgodElementSystem {
    force: number;
    physicsId: string;
}
