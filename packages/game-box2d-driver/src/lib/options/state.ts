import { b2World } from '@box2d/core';
import { Observable } from 'rxjs';

export interface GameBox2dOptions {
    contactListener: boolean;
    world: b2World;
    update$: Observable<number>;
}
