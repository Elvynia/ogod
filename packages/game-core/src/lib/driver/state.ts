import { Observable } from 'rxjs';

export type Driver<SI, SO> = (sink$: Promise<SI>) => SO;

export type ObservableState = Record<string, Observable<any>>;

export type Sinks<SO> = {
    [K in keyof SO]: Observable<any> | ObservableState;
}

export type Drivers<SO, SI extends Sinks<SO>> = {
    [K in keyof SO]: Driver<SI[K], SO[K]>;
}
