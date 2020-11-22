import { Box2dStateShapeBox } from "../shape-box/state";
import { Box2dStateShapeCircle } from '../shape-circle/state';
import { Box2dStateShapePoly } from "../shape-poly/state";

export interface Box2dStateFixture {
    density?: number;
    friction?: number;
    restitution?: number;
    shape: Box2dStateShapeBox | Box2dStateShapePoly | Box2dStateShapeCircle;
}
