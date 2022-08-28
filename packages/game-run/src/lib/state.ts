import { Driver } from '@ogod/game-core';
import { Observable } from 'rxjs';

export interface ObservableState {
    [key: string]: Observable<any>;
}

export type Sinks<SO> = {
    [K in keyof SO]: Observable<any> | ObservableState;
}

export type Drivers<SO, SI extends Sinks<SO>> = {
    [K in keyof SO]: Driver<SI[K], SO[K]>;
}
