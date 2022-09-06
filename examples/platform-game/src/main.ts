import { canvas, div, h, h3, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, distinctUntilChanged, distinctUntilKeyChanged, filter, first, from, fromEvent, map, merge, Observable, of, startWith, Subject, switchMap, throttleTime } from 'rxjs';
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
            ),
            from(sources.DOM.select('#start').events('click') as any as Observable<MouseEvent>).pipe(
                map((e) => {
                    (e.target as any).remove();
                    return makeWorkerMessage({
                        key: 'start',
                        value: true
                    });
                })
            )
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', tabindex: 0 } })),
            merge(
                sources.GameWorker.input$.pipe(
                    map((state) => !!state.loading),
                    startWith(false),
                    distinctUntilChanged(),
                    switchMap((shouldLoad) => shouldLoad ? sources.GameWorker.input$.pipe(
                        map((state) => Object.values(state.loading)),
                        filter((loadings) => loadings.length > 0),
                        map((loadings) => loadings.map((l) => div({
                            class: {
                                loading: true
                            },
                        }, [l.message])))
                    ) : of([]))
                ),
                sources.GameWorker.input$.pipe(
                    filter((s) => s.loaded),
                    first(),
                    map(() => [h('div', {
                        props: {
                            id: 'start'
                        }
                    }, 'START')])
                )
            ),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3('FPS: ' + fps)),
            )
        ]).pipe(
            map(([canvas, uis, fps]) => div([
                div({
                    attrs: {
                        id: 'wrapper'
                    }
                }, [canvas, ...uis]),
                fps
            ]))
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
