import {
    engineCanvas, engineDestroy, engineInit, engineReflectUpdates,
    engineStart, engineStop, OgodStateEngine, OgodStore, OGOD_CATEGORY
} from '@ogod/common';
import { animationFrameScheduler, asyncScheduler, BehaviorSubject, defer, of, Subject } from 'rxjs';
import { bufferTime, filter, map, pairwise, repeat, withLatestFrom } from "rxjs/operators";
import { OgodRuntimeActor } from '../actor/runtime';
import { watchReactiveStates } from '../util/reactive-watch';
import { OgodRuntimeRegistry } from '../util/registry';
import { OgodRuntimeScene } from '../scene/runtime';

declare var self: OgodRuntimeEngine;

export type OgodRuntimes = {
    [category: string]: { [id: string]: OgodRuntimeActor<any, any> };
}

export interface OgodRuntimeEngine extends Worker {
    id: string;
    baseHref: string;
    running: boolean;
    canvas: OffscreenCanvas;
    registry: OgodRuntimeRegistry;
    intervalUpdate: number;
    debugMode: boolean;
    store: OgodStore;
    runtimes: OgodRuntimes;
    getRuntime: <R extends OgodRuntimeActor<any, any, C>, C extends string = string>(category: C, id: string) => R;
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

export const initEngine = ({ id, categories }) => {
    console.log('[ENGINE] Initialize');
    self.id = id;
    self.running = false;
    self.runtimes = categories
        .map((category) => ({ [category]: {} }))
        .reduce((a, b) => Object.assign(a, b), {}) as any;
    self.getRuntime = <R extends OgodRuntimeActor<any, any, C>, C extends string>(category: C, id: string) =>
        self.runtimes[category][id] as R;
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
        scenes.filter((scene) => scene.running).forEach((scene) => self.getRuntime<OgodRuntimeScene>('scene', scene.id).render(scene));
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
            initEngine(evt.data);
            break;
        case engineCanvas.type:
            self.canvas = evt.data.canvas;
            self.store.dispatch({ ...evt.data });
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
            self.store.dispatch({ ...evt.data, ports: evt.ports });
            break;
    }
}
