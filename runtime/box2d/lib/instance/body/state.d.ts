import { b2Body } from '@flyover/box2d';
import { Box2dStateShapeBox } from "../shape-box/state";
import { Box2dStateShapePoly } from "../shape-poly/state";
import { OgodStateInstance } from "@ogod/common";
export interface Box2dStateBody extends OgodStateInstance {
    dynamic?: boolean;
    x: number;
    y: number;
    density?: number;
    friction?: number;
    restitution?: number;
    angle?: number;
    fixedRotation?: boolean;
    shape: Box2dStateShapeBox | Box2dStateShapePoly;
    body$: b2Body;
}
