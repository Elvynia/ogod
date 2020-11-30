import { OgodStateInstance } from '@ogod/common';
import { OgodStatePositionable } from '@ogod/runtime-core';
import { Box2dStateShapePoly } from '../shape-poly/state';
import { Box2dStateShapeBox } from './../shape-box/state';
import { Box2dStateShapeCircle } from './../shape-circle/state';

export interface Box2dStateSensor {
    id: string;
    shape: Box2dStateShapeBox | Box2dStateShapeCircle | Box2dStateShapePoly;
    contacts: number;
}

export interface Box2dStateInstanceSensor extends OgodStateInstance {
    sensors: Box2dStateSensor[];
}

export function hasSensors(state): state is Box2dStateInstanceSensor {
    return state.sensors?.length != null;
}
