import { OgodElementPositionable, OgodElementSizeable, OgodElementInstance } from '@ogod/element-core';
import { Box2dStateSensor } from '@ogod/runtime-box2d';
import { Box2dElementShape } from '../shape/element';

export interface Box2dElementSensor extends HTMLElement {
    category: 'sensor';
    id: string;
    contacts: number;
    shape: Box2dElementShape;
}

export interface Box2dElementInstanceSensors extends OgodElementInstance {
    sensors: Box2dStateSensor[];
}
