import { canvas, div, h3, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, concatWith, distinctUntilKeyChanged, filter, first, from, map, merge, of, startWith, Subject, takeWhile, tap } from 'rxjs';
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
            sources.GameWorker.input$.pipe(
                map((state) => Object.values(state.loading)),
                filter((loadings) => loadings.length > 0),
                tap((loadings) => console.log('generating map', loadings[0].progress)),
                takeWhile((loadings) => loadings.some((l) => l.progress < 1)),
                map((loadings) => loadings.map((l) => div(l.message))),
                concatWith(of(canvas({ attrs: { id: 'game', width: camera.width, height: camera.height, tabindex: 0 } })))
            ),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3('FPS: ' + fps)),
            )
        ]).pipe(
            map(([canvas, fps]) => Array.isArray(canvas) ? div([...canvas, fps]) : div([canvas, fps]))
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
