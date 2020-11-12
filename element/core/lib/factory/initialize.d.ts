import { AsyncState } from './async';
import { BehaviorSubject } from "rxjs";
export declare const ogodFactoryInitialize$: () => {
    get: () => BehaviorSubject<AsyncState>;
    connect: (host: any, key: any, invalidate: any) => void;
};
