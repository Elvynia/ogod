import { OgodStateEngine, OgodStore } from '@ogod/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { OgodCategoryRuntime } from '../util/category';
import { OgodRegistry } from '../util/registry';
export declare type OgodRuntimes<C extends OgodCategoryRuntime = OgodCategoryRuntime> = {
    [K in keyof C]: {
        [id: string]: C[K];
    };
};
export interface OgodRuntimeEngine<C extends OgodCategoryRuntime = OgodCategoryRuntime> extends Worker {
    id: string;
    baseHref: string;
    running: boolean;
    canvas: OffscreenCanvas;
    registry: OgodRegistry;
    intervalUpdate: number;
    debugMode: boolean;
    store: OgodStore;
    runtimes: OgodRuntimes<C>;
    reflect$: Subject<{
        id: string;
        state: any;
    }>;
    state$: BehaviorSubject<OgodStateEngine>;
    update$: Subject<number>;
    close: Function;
}
export declare const requestAnimationFrame$: import("rxjs").Observable<number>;
export declare const initEngine: (id: any, categories?: string[]) => void;
export declare const nextCanvas: (canvas: any) => void;
export declare const start: () => void;
export declare const stop: () => void;
export declare function ogodRuntimeEngineDefault(evt: any): void;
