import { canvas, div, h3, input, makeDOMDriver } from '@cycle/dom';
import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, concat, debounceTime, distinctUntilKeyChanged, filter, first, from, fromEvent, interval, map, merge, of, startWith, Subject, switchMap, take, takeUntil } from 'rxjs';
import xs from 'xstream';
import { ReflectState } from './app/reflector/state';
import { makeScreen } from './app/screen/make';
import { AppSources } from './app/state';

function main(sources: AppSources) {
    let paused = false;
    const playerColor = '#ff33ff';
    const screen = makeScreen(800, 600);
    const canvas$ = sources.DOM.select('#game');
    const offscreen$ = from(canvas$.element() as any).pipe(
        take(1),
        switchMap((canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            return concat(
                of(makeEngineAction('OGOD_ENGINE_CANVAS', offscreen, [offscreen])),
                fromEvent(window, 'resize').pipe(
                    debounceTime(16),
                    startWith(screen),
                    map(() => makeWorkerMessage({
                        key: 'screen',
                        value: {
                            ...screen,
                            width: canvas.clientWidth,
                            height: canvas.clientHeight
                        }
                    }))
                )
            )
        })
    );
    const addRect$ = from(canvas$.events('mousedown') as any).pipe(
        switchMap((e) => interval(200).pipe(
            map(() => e),
            takeUntil(fromEvent(document, 'mouseup').pipe(
                first()
            )),
            map(({ clientX, clientY }) => makeWorkerMessage({
                key: 'objects',
                value: {
                    x: clientX + Math.round(200 - Math.random() * 400),
                    y: clientY + Math.round(200 - Math.random() * 400)
                }
            }))
        ))
    );
    const paused$ = from(canvas$.events('focus') as any).pipe(
        switchMap(() => from(canvas$.events('keydown') as any).pipe(
            takeUntil(from(canvas$.events('blur') as any)),
            filter((e: KeyboardEvent) => e.code === 'Space'),
            map(() => paused = !paused)
        )),
        startWith(paused),
        map((value) => makeWorkerMessage({ key: 'paused', value }))
    );
    const playerColor$ = from(sources.DOM.select('#playerColor').events('input') as any).pipe(
        map((e: Event) => (e.target as any).value),
        filter((value) => value && value.length === 7),
        startWith(playerColor),
        map((value) => makeWorkerMessage({ key: 'playerColor', value }))
    );
    return {
        GameWorker: merge(
            addRect$,
            offscreen$,
            paused$,
            playerColor$
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', width: screen.width, height: screen.height, tabindex: 0 } })),
            sources.GameWorker.input$.pipe(
                map((state) => state.objects.map(({ id, x, y, angle, width, height, health }) => div({
                    attrs: {
                        id
                    },
                    class: {
                        rect: true
                    },
                    style: {
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: `translate(calc(${x}px - 50%), calc(${screen.height - y}px - 50%))rotate(${angle}rad)`
                    }
                }, [health.toString()]))),
                startWith([])
            ),
            of(div([
                input({ attrs: { id: 'playerColor', value: playerColor } })
            ])),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3('FPS: ' + fps)),
            ),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('objectCount'),
                map((state: any) => state.objectCount),
                startWith('0'),
                map((objects) => h3('Object count: ' + objects)),
            )
        ]).pipe(
            map(([canvas, divs, color, fps, objects]) => div([
                div({
                    class: {
                        wrapper: true
                    }
                }, [canvas, ...divs]),
                div({
                    class: {
                        content: true
                    }
                }, [color, fps, objects])
            ]))
        )
    };
}

const dispose = gameRun(main, {
    GameWorker: makeGameEngineWorker<ReflectState>(new Worker(new URL('worker.ts', import.meta.url))),
    DOM: (promise) => {
        const dom = makeDOMDriver('#app');
        const wrapper = new Subject();
        promise.then((sink$) => sink$.subscribe(wrapper))
        return dom(xs.from(wrapper));
    }
});
window.onunload = (e) => dispose();
