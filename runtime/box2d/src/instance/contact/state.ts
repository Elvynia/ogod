import { b2Vec2 } from '@flyover/box2d';

export interface Box2dStateContact {
    target: string;
    fxSource: string;
    fxTarget: string;
    normal: b2Vec2;
    origin: b2Vec2;
}
