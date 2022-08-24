import { canvas, div, h3, input, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { combineLatest, distinctUntilKeyChanged, filter, first, from, map, merge, of, startWith, switchMap, take, takeUntil, throttleTime } from 'rxjs';
import { AppSources } from './app/state';

function main(sources: AppSources) {
    const canvas$ = sources.DOM.select('#game');
    const offscreen$ = from(canvas$.element() as any).pipe(
        map((canvas: any) => canvas.transferControlToOffscreen()),
        take(1),
        map((offscreen) => makeWorkerMessage({
            key: 'engine', value: {
                type: 'OGOD_ENGINE_CANVAS',
                canvas: offscreen
            }
        }, [offscreen]))
    );
    const addRect$ = from(canvas$.events('mousedown') as any).pipe(
        switchMap((e) => from(canvas$.events('mousemove') as any).pipe(
            startWith(e),
            throttleTime(100),
            takeUntil(from(canvas$.events('mouseup') as any).pipe(
                first()
            )),
            map(({ clientX, clientY }) => makeWorkerMessage({
                key: 'objects',
                value: {
                    x: clientX,
                    y: clientY
                }
            }))
        ))
    );
    let paused = false;
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
        startWith('#ff33ff'),
        map((value) => makeWorkerMessage({ key: 'playerColor', value }))
    );
    const app = {
        width: 800,
        height: 600
    };
    return {
        GameWorker: merge(
            addRect$,
            offscreen$,
            paused$,
            playerColor$
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', width: app.width, height: app.height, tabindex: 0 } })),
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
                        transform: `translate(calc(${x}px - 50%), calc(${app.height - y}px - 50%))rotate(${angle}rad)`
                    }
                }, [health.toString()])))
            ),
            of(div([
                input({ attrs: { id: 'playerColor', value: '#ff33ff' } })
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

const dispose = run(main, {
    GameWorker: makeGameEngineWorker(new Worker(new URL('worker.ts', import.meta.url))),
    DOM: makeDOMDriver('#app')
});
window.onunload = (e) => dispose();
