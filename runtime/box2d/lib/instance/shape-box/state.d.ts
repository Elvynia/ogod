export interface Box2dStateShapeBox {
    x: number;
    y: number;
    centerX?: number;
    centerY?: number;
    angle?: number;
}
export declare function isShapeBox(shape: any): shape is Box2dStateShapeBox;
