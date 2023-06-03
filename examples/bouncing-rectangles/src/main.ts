import { canvas, div, h3, input, makeDOMDriver, span } from '@cycle/dom';
import { run } from '@ogod/run';
import { makeDriverGameWorker, makeEngineAction, makeWorkerMessage } from '@ogod/driver-worker';
import { EMPTY, Subject, combineLatest, concat, debounceTime, delayWhen, distinctUntilChanged, distinctUntilKeyChanged, filter, first, from, fromEvent, interval, map, merge, of, startWith, switchMap, take, takeUntil, takeWhile, timer } from 'rxjs';
import xs from 'xstream';
import { Camera } from './app/camera/state';
import { AppReflectState, AppSources } from './app/state';

function main(sources: AppSources) {
    let paused = false;
    const playerColor = '#ff33ff';
    const camera: Camera = {
        width: 800,
        height: 600,
        scale: 10
    }
    const canvas$ = sources.DOM.select('#game');
    const offscreen$ = from(canvas$.element() as any).pipe(
        take(1),
        switchMap((canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            return concat(
                of(makeEngineAction('OGOD_ENGINE_TARGET', offscreen, [offscreen])),
                fromEvent(window, 'resize').pipe(
                    debounceTime(16),
                    startWith(camera),
                    map(() => makeWorkerMessage({
                        key: 'camera',
                        value: {
                            ...camera,
                            width: canvas.clientWidth,
                            height: canvas.clientHeight
                        }
                    }))
                )
            )
        })
    );
    const addRect$ = from(canvas$.events('mousedown') as any).pipe(
        switchMap((e) => paused ? EMPTY : timer(200).pipe(
            switchMap(() => interval(100).pipe(
                map(() => e as MouseEvent),
                map(({ clientX, clientY }) => makeWorkerMessage({
                    key: 'objects',
                    value: {
                        x: clientX + Math.round(200 - Math.random() * 400),
                        y: clientY + Math.round(200 - Math.random() * 400)
                    }
                }))
            )),
            takeWhile(() => !paused),
            takeUntil(fromEvent(document, 'mouseup').pipe(
                first()
            ))
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
        delayWhen(() => sources.GameWorker.initialized$),
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
            of(canvas({ attrs: { id: 'game', width: camera.width, height: camera.height, tabindex: 0 } })),
            sources.GameWorker.input$.pipe(
                map((state) => state.objects.map(({ x, y, angle, width, height, health, colorLight }) => div({
                    class: {
                        rect: true
                    },
                    style: {
                        color: colorLight ? 'black' : 'white',
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: `translate(calc(${x}px - 50%), calc(${camera.height - y}px - 50%))rotate(${angle}rad)`
                    }
                }, [health.toString()]))),
                startWith([])
            ),
            of(div({
                attrs: {
                    style: 'display: flex;justify-content: space-between'
                }
            }, [
                input({ attrs: { id: 'playerColor', value: playerColor } }),
                span('Use space to pause simulation')
            ])),
            sources.GameWorker.input$.pipe(
                distinctUntilKeyChanged('fps'),
                map((state: any) => state.fps),
                startWith(''),
                map((fps) => h3('FPS: ' + fps)),
            ),
            sources.GameWorker.input$.pipe(
                map((state) => state.objects.length),
                distinctUntilChanged(),
                startWith('0'),
                map((count) => h3('Object count: ' + count)),
            ),
            sources.GameWorker.input$.pipe(
                map((state) => state.box2dCount),
                distinctUntilChanged(),
                startWith('0'),
                map((count) => h3('Box2D count: ' + count)),
            )
        ]).pipe(
            map(([canvas, divs, color, fps, count1, count2]) => div([
                div({
                    class: {
                        wrapper: true
                    }
                }, [canvas, ...divs]),
                div({
                    class: {
                        content: true
                    }
                }, [color, fps, count1, count2])
            ]))
        )
    };
}

(window as any).stopApp = run(main, {
    GameWorker: makeDriverGameWorker<AppReflectState>(new Worker(new URL('worker.ts', import.meta.url))),
    DOM: (promise) => {
        const dom = makeDOMDriver('#app');
        const wrapper = new Subject();
        promise.then((sink$) => sink$.subscribe(wrapper))
        return dom(xs.from(wrapper));
    }
});
