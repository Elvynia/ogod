import { OgodElementInstance } from "@ogod/element-core";
export interface D2ElementSize extends OgodElementInstance {
    size: number;
}
export interface D2ElementSizeXY extends OgodElementInstance {
    sizeX: number;
    sizeY: number;
    size: {
        x: number;
        y: number;
    };
}
