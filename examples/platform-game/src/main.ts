import { canvas, div, h3, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, distinctUntilChanged, distinctUntilKeyChanged, filter, first, from, fromEvent, map, merge, of, startWith, Subject } from 'rxjs';
import xs from 'xstream';
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
    const jump$ = combineLatest([
        merge(
            fromEvent(document, 'keydown').pipe(
                filter((e: KeyboardEvent) => e.code === 'Space'),
                map(() => true)
            ),
            fromEvent(document, 'keyup').pipe(
                filter((e: KeyboardEvent) => e.code === 'Space'),
                map(() => false)
            )
        ).pipe(
            distinctUntilChanged()
        )
    ]).pipe(
        startWith([false]),
        map(([jump]) => makeWorkerMessage({ key: 'controls', value: { jump } })),
    );
    const app = {
        width: 800,
        height: 600,
        scale: 10
    };
    return {
        GameWorker: merge(
            jump$,
            offscreen$,
            of(makeWorkerMessage({
                key: 'app',
                value: app
            }))
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', width: app.width, height: app.height, tabindex: 0 } })),
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
