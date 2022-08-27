import { canvas, div, h3, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, distinctUntilChanged, distinctUntilKeyChanged, filter, first, from, fromEvent, map, merge, of, startWith, Subject, tap } from 'rxjs';
import xs from 'xstream';
import { makeControls$ } from './app/controls/make';
import { AppReflectState, AppSources } from "./app/state";

function main(sources: AppSources) {
    const canvas$ = sources.DOM.select('#game');
    const offscreen$ = from(canvas$.element() as any).pipe(
        map((canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            offscreen.width = canvas.clientWidth;
            offscreen.height = canvas.clientHeight;
            return offscreen;
        }),
        first(),
        map((offscreen) => makeEngineAction('OGOD_ENGINE_CANVAS', offscreen, [offscreen]))
    );
    const camera = {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        scale: 10
    };
    return {
        GameWorker: merge(
            makeControls$({ jump: 'Space', left: 'KeyA', right: 'KeyD' }),
            offscreen$,
            of(makeWorkerMessage({
                key: 'camera',
                value: camera
            }))
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', width: camera.width, height: camera.height, tabindex: 0 } })),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3('FPS: ' + fps)),
            )
        ]).pipe(
            map(([canvas, fps]) => div([canvas, fps]))
        )
    }
}

const dispose = gameRun(main, {
    GameWorker: makeGameEngineWorker<AppReflectState>(new Worker(new URL('worker.ts', import.meta.url))),
    DOM: (promise) => {
        const dom = makeDOMDriver('#app');
        const wrapper = new Subject();
        promise.then((sink$) => sink$.subscribe(wrapper))
        return dom(xs.from(wrapper));
    }
});
window.onunload = (e) => dispose();
