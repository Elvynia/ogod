import { OgodStateSystem } from '@ogod/common';
import { Subscription } from 'rxjs';
export interface Box2dStateJump extends OgodStateSystem {
    force: number;
    physicsId: string;
    subscriptions: {
        [id: string]: Subscription;
    };
}
