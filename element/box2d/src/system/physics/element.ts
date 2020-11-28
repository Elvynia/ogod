import { OgodElementSystem } from "@ogod/element-core";

export interface Box2dElementPhysics extends OgodElementSystem {
    contactListener: string;
    gravityX: number;
    gravityY: number;
    modifier: string;
    modifierX: string;
    modifierY: string;
}
