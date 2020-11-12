import { OgodElementSystem } from "@ogod/element-core";

export interface Box2dElementPhysics extends OgodElementSystem {
    gravityX: number;
    gravityY: number;
}
