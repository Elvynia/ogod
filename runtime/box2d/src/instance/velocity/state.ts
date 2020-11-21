import { Box2dStateInstanceBody } from './../body/state';

export interface Box2dStateInstanceVelocity extends Box2dStateInstanceBody {
    tx: number;
    ty: number;
    velocityX: number;
    velocityY: number;
}
