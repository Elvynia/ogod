import { Driver } from '@ogod/game-core';
import { Observable } from 'rxjs';

export type Sinks<SO> = {
    [K in keyof SO]: Observable<any>;
}

export type Drivers<SO, SI extends Sinks<SO>> = {
    [K in keyof SO]: Driver<SI[K], SO[K]>;
}
