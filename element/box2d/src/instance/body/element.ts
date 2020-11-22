import { Box2dStateFixture } from '@ogod/runtime-box2d';
import { OgodElementInstance, ogodFactoryInstanceChildren } from '@ogod/element-core';

export interface Box2dElementBody extends HTMLElement {
    category: 'body';
    x: number;
    y: number;
    dynamic: boolean;
    density?: number;
    friction?: number;
    restitution?: number;
    fixedRotation: boolean;
    fixtures: Box2dStateFixture[];
}

export interface Box2dElementInstanceBody extends OgodElementInstance {
    body: Box2dElementBody;
}
