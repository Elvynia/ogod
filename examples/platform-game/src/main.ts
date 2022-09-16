import { canvas, div, h, h3, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, distinctUntilChanged, distinctUntilKeyChanged, filter, first, from, fromEvent, map, merge, Observable, of, startWith, Subject, switchMap, throttleTime } from 'rxjs';
import xs from 'xstream';
import { makeControls$ } from './app/controls/make';
import { makeElementMenu$, makeListenerMenu$ } from './app/menu/make';
import { PHASE } from './app/phase/state';
import { AppReflectState, AppSources } from "./app/state";
import { randColor } from './app/util';

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
                map(() => makeWorkerMessage({
                    key: 'phase',
                    value: PHASE.LOAD
                }))
            ),
            fromEvent(document, 'keyup').pipe(
                filter((e: KeyboardEvent) => e.code === 'Escape'),
                map(() => makeWorkerMessage({ key: 'paused' }))
            ),
            makeListenerMenu$(sources)
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
                    distinctUntilKeyChanged('phase'),
                    filter((s) => s.phase === PHASE.START),
                    map(() => [h('div', {
                        props: {
                            id: 'start'
                        }
                    }, 'START')])
                )
            ),
            sources.GameWorker.input$.pipe(
                map((s) => s.paused),
                distinctUntilChanged(),
                switchMap((paused) => paused ? makeElementMenu$(sources) : of(null))
            ),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3({ props: { id: 'fps' } }, 'FPS: ' + fps))
            ),
            sources.GameWorker.input$.pipe(
                filter((s) => s.level !== undefined),
                distinctUntilKeyChanged('level'),
                map((state: any) => state.level),
                map((l) => h3({ props: { id: 'level' } }, 'Level: ' + l)),
                startWith(null)
            )
        ]).pipe(
            map(([canvas, uis, menu, fps, level]) => {
                const children = [canvas, ...uis, fps];
                if (menu) {
                    children.push(menu);
                }
                if (level) {
                    children.push(level);
                }
                return div([
                    div({
                        attrs: {
                            id: 'wrapper'
                        }
                    }, children)
                ]);
            })
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
