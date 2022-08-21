import { canvas, div, h3, input, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { makeGameEngineWorker, WorkerMessage } from '@ogod/game-engine-worker';
import { combineLatest, distinctUntilChanged, filter, first, from, map, merge, Observable, of, startWith, switchMap, take, takeUntil, throttleTime } from 'rxjs';
import { AppSources } from './app/state';

function main(sources: AppSources) {
    const canvas$ = sources.DOM.select('#game');
    const offscreen$ = from(canvas$.element() as any).pipe(
        map((canvas: any) => canvas.transferControlToOffscreen()),
        take(1),
        map((offscreen) => [{ key: 'app', value: { canvas: offscreen } }, [offscreen]])
    );
    const addRect$ = from(canvas$.events('mousedown') as any as Observable<MouseEvent>).pipe(
        switchMap((e) => from(canvas$.events('mousemove') as any).pipe(
            startWith(e),
            throttleTime(100),
            takeUntil(from(canvas$.events('mouseup') as any).pipe(
                first()
            )),
            map(({ clientX, clientY }) => [{
                key: 'objects',
                value: {
                    x: clientX,
                    y: clientY
                }
            }] as WorkerMessage)
        ))
    );
    const paused$ = from(canvas$.events('focus') as any).pipe(
        switchMap(() => from(canvas$.events('keydown') as any).pipe(
            takeUntil(from(canvas$.events('blur') as any)),
            filter((e: KeyboardEvent) => e.code === 'Space'),
            map(() => false)
        )),
    ).pipe(
        startWith(false),
        map((value) => [{ key: 'paused', value }] as WorkerMessage)
    );
    const playerColor$ = from(sources.DOM.select('#playerColor').events('input') as any).pipe(
        map((e: Event) => (e.target as any).value),
        filter((value) => value && value.length === 7),
        startWith('#ff33ff'),
        map((value) => [{ key: 'player', value }] as WorkerMessage)
    );
    return {
        GameWorker: merge(
            addRect$,
            offscreen$,
            paused$,
            playerColor$
        ),
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', width: 800, height: 600, tabindex: 0 } })),
            of(div([
                input({ attrs: { id: 'playerColor', value: '#ff33ff' } })
            ])),
            sources.GameWorker.input$.pipe(
                map((state: any) => state.fps),
                startWith(''),
                distinctUntilChanged(),
                map((fps) => h3('FPS: ' + fps)),
            )
        ]).pipe(
            map(([canvas, p, fps]) => div([canvas, div({ class: { content: true } }, [p, fps])]))
        )
    };
}

const dispose = run(main, {
    GameWorker: makeGameEngineWorker(new Worker(new URL('worker.ts', import.meta.url))),
    DOM: makeDOMDriver('#app')
});
window.onunload = (e) => dispose();
