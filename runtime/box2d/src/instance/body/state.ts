import { Box2dStateContact } from './../contact/state';
import { Box2dStateFixture } from './../fixture/state';
import { b2Body } from '@flyover/box2d';
import { OgodStateInstance } from '@ogod/common';

export interface Box2dStateInstanceBody extends OgodStateInstance {
    contacts: { [id: string]: Box2dStateContact };
    body: Box2dStateBody;
    body$: b2Body;
}

export interface Box2dStateBody {
    dynamic?: boolean;
    x: number;
    y: number;
    angle?: number;
    fixedRotation?: boolean;
    fixtures: Box2dStateFixture[];
}
