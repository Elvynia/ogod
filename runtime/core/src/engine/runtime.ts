import {
    OgodStateEngine, OgodStore, OGOD_CATEGORY, sceneChangesCanvas, engineReflectUpdates,
    engineInit, engineCanvas, engineStart, engineStop, engineDestroy
} from '@ogod/common';
import { animationFrameScheduler, BehaviorSubject, defer, of, Subject, asyncScheduler } from 'rxjs';
import { bufferTime, filter, map, pairwise, repeat, withLatestFrom, tap } from "rxjs/operators";
import { OgodCategoryRuntime } from '../util/category';
import { watchReactiveStates } from '../util/reactive-watch';
import { OgodRegistry } from '../util/registry';

declare var self: OgodRuntimeEngine;

export type OgodRuntimes<C extends OgodCategoryRuntime = OgodCategoryRuntime> = {
    [K in keyof C]: { [id: string]: C[K] };
}

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
    reflect$: Subject<{ id: string, state: any }>;
    state$: BehaviorSubject<OgodStateEngine>;
    update$: Subject<number>;
    close: Function;
}

export const requestAnimationFrame$ = defer(() =>
    of(animationFrameScheduler.now(), animationFrameScheduler).pipe(
        repeat(),
        map((start) => animationFrameScheduler.now() - start),
        pairwise(),
        map((time) => time[1] - time[0])
    )
);

export const initEngine = (id, categories: string[] = Object.values(OGOD_CATEGORY)) => {
    console.log('[ENGINE] Initialize');
    self.running = false;
    self.runtimes = categories
        .map((category) => ({ [category]: {} }))
        .reduce((a, b) => Object.assign(a, b), {}) as any;
    self.id = id;
}

export const nextCanvas = (canvas) => {
    Object.entries(self.runtimes['scene'])
        .map(([id, scene]) => ({
            runtime: scene,
            state: self.store.getState().scene[id]
        }))
        .forEach((scene) => {
            const changes = scene.runtime.nextCanvas(scene.state, canvas, self.canvas);
            if (changes) {
                self.store.dispatch(sceneChangesCanvas({
                    id: scene.state.id,
                    changes
                }));
            }
        });
    self.canvas = canvas;
}

export const start = () => {
    console.log('[ENGINE] Start');
    self.running = true;
    self.update$ = new Subject();
    self.reflect$ = new Subject();
    requestAnimationFrame$.subscribe(self.update$);
    watchReactiveStates('system');
    watchReactiveStates('scene');
    watchReactiveStates('instance');
    self.update$.pipe(
        withLatestFrom(self.state$.pipe(
            map((fs) => Object.values(fs.scene).filter((scene) => scene.loaded))
        ))
    ).subscribe(([delta, scenes]) => {
        scenes.filter((scene) => scene.running).forEach((scene) => self.runtimes['scene'][scene.id].render(scene));
    });
    self.reflect$.pipe(
        // bufferTime(self.intervalUpdate, animationFrameScheduler), FIXME: scheduler
        bufferTime(self.intervalUpdate, asyncScheduler),
        filter((updates) => updates.length > 0),
    ).subscribe((updates) => self.postMessage(engineReflectUpdates({ updates })));
}

export const stop = () => {
    console.log('[ENGINE] Stop');
    self.update$.complete();
    self.reflect$.complete();
    // self.subscriptions.forEach((sub) => sub.unsubscribe());
    self.running = false;
}

export function ogodRuntimeEngineDefault(evt: any) {
    switch (evt.data.type) {
        case engineInit.type:
            initEngine(evt.data.id);
            break;
        case engineCanvas.type:
            nextCanvas(evt.data.canvas);
            break;
        case engineStart.type:
            if (!self.running) {
                start();
            } else {
                console.warn('[ENGINE] Cannot start engine, already running !');
            }
            break;
        case engineStop.type:
            if (self.running) {
                stop();
            } else {
                console.warn('[ENGINE] Cannot stop engine, already stopped !');
            }
            break;
        case engineDestroy.type:
            console.log('[ENGINE] Destroy');
            stop();
            self.close();
            break;
        default:
            self.store.dispatch({ ...evt.data });
            break;
    }
}
