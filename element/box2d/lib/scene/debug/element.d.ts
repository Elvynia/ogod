import { OgodElementScene } from "@ogod/element-core";
export interface Box2dElementDebug extends OgodElementScene {
    draw: boolean;
    physicsId: string;
}
