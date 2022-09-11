import { XY } from '@box2d/core';
import { Observable } from 'rxjs';

export interface GameBox2dSink {
    update$: Observable<number>;
    gravity$: Observable<XY>
}
