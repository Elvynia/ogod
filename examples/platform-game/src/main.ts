import { canvas, div, h3, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, concatWith, distinctUntilKeyChanged, filter, first, from, fromEvent, map, merge, of, startWith, Subject, switchMap, takeWhile, tap, throttleTime } from 'rxjs';
import xs from 'xstream';
import { makeControls$ } from './app/controls/make';
import { AppReflectState, AppSources } from "./app/state";

function main(sources: AppSources) {
    const canvas$ = from(sources.DOM.select('#game').element() as any);
    const offscreen$ = canvas$.pipe(
        map((canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            offscreen.width = canvas.clientWidth;
            offscreen.height = canvas.clientHeight;
            return offscreen;
        }),
        first(),
        map((offscreen) => makeEngineAction('OGOD_ENGINE_CANVAS', offscreen, [offscreen]))
    );
    return {
        GameWorker: merge(
            makeControls$({ jump: 'Space', left: 'KeyA', right: 'KeyD' }),
            offscreen$,
            canvas$.pipe(
                first(),
                switchMap((canvas: any) => fromEvent(window, 'resize').pipe(
                    throttleTime(16),
                    startWith(null),
                    map(() => makeWorkerMessage({
                        key: 'camera',
                        value: {
                            width: canvas.clientWidth,
                            height: canvas.clientHeight
                        }
                    }))
                ))
            )
        ),
        DOM: combineLatest([
            sources.GameWorker.input$.pipe(
                takeWhile((state) => !!state.loading),
                map((state) => Object.values(state.loading)),
                filter((loadings) => loadings.length > 0),
                map((loadings) => loadings.map((l) => div(l.message))),
                concatWith(of(canvas({ attrs: { id: 'game', tabindex: 0 } })))
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
