import { canvas, div, h, h3, makeDOMDriver } from '@cycle/dom';
import { makeMessage, makeTargetActions } from '@ogod/core';
import { makeDriverWorker } from '@ogod/driver-worker';
import { run } from '@ogod/run';
import { Observable, Subject, combineLatest, distinctUntilChanged, distinctUntilKeyChanged, filter, first, from, fromEvent, map, merge, of, startWith, switchMap } from 'rxjs';
import xs from 'xstream';
import { makeControls$ } from './app/controls/make';
import { makeElementMenu$, makeListenerMenu$ } from './app/menu/make';
import { PHASE } from './app/phase/state';
import { AppReflectState, AppSources } from "./app/state";

function main(sources: AppSources) {
    return {
        Worker: merge(
            makeControls$({ jump: 'Space', left: 'KeyA', right: 'KeyD' }),
            from(sources.DOM.select('#game').element() as any).pipe(
                first(),
                switchMap((canvas: HTMLCanvasElement) => makeTargetActions({
                    canvas,
                    resizeDebounceTime: 16
                }))
            ),
            from(sources.DOM.select('#start').events('click') as any as Observable<MouseEvent>).pipe(
                map(() => makeMessage({
                    key: 'phase',
                    value: PHASE.LOAD
                }))
            ),
            fromEvent(document, 'keyup').pipe(
                filter((e: KeyboardEvent) => e.code === 'Escape'),
                map(() => makeMessage({ key: 'paused' }))
            ),
            makeListenerMenu$(sources)
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', tabindex: 0 } })),
            merge(
                sources.Worker.input$.pipe(
                    map((state) => Object.keys(state.loading || {}).length > 0),
                    startWith(false),
                    distinctUntilChanged(),
                    switchMap((shouldLoad) => shouldLoad ? sources.Worker.input$.pipe(
                        map((state) => Object.values(state.loading)),
                        filter((loadings) => loadings.length > 0),
                        map((loadings) => loadings.map((l) => div({
                            class: {
                                loading: true
                            },
                        }, [l.message, l.progress.toString()])))
                    ) : of([]))
                ),
                sources.Worker.input$.pipe(
                    distinctUntilKeyChanged('phase'),
                    filter((s) => s.phase === PHASE.START),
                    map(() => [h('div', {
                        props: {
                            id: 'start'
                        }
                    }, 'START')])
                )
            ),
            sources.Worker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3({ props: { id: 'fps' } }, 'FPS: ' + fps))
            ),
            sources.Worker.input$.pipe(
                filter((s) => s.level !== undefined),
                distinctUntilKeyChanged('level'),
                map((state: any) => state.level),
                map((l) => h3({ props: { id: 'level' } }, 'Level: ' + l)),
                startWith(null)
            ),
            sources.Worker.input$.pipe(
                map((s) => s.paused),
                distinctUntilChanged(),
                switchMap((paused) => paused ? makeElementMenu$(sources) : of(null))
            )
        ]).pipe(
            map(([canvas, uis, fps, level, menu]) => {
                const children = [canvas, ...uis, fps];
                if (level) {
                    children.push(level);
                }
                if (menu) {
                    children.push(menu);
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
const worker = new Worker(new URL('worker.ts', import.meta.url));
(window as any).stopApp = run(main, {
    Worker: makeDriverWorker<AppReflectState>(worker),
    DOM: (promise) => {
        const dom = makeDOMDriver('#app');
        const wrapper = new Subject();
        promise.then((sink$) => sink$.subscribe(wrapper))
        return dom(xs.from(wrapper));
    }
});
