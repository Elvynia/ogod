import { b2Vec2 } from '@flyover/box2d';
import { Box2dStateInstanceBody } from '../body/state';

export interface Box2dStateContact {
    target: Box2dStateInstanceBody;
    fxSource: any;
    fxTarget: any;
    normal: b2Vec2;
    origin: b2Vec2;
}
