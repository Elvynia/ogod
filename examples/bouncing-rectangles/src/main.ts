import { canvas, div, h3, input, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { makeGameEngineWorker, WorkerMessage } from '@ogod/game-engine-worker';
import { combineLatest, distinctUntilChanged, filter, from, map, merge, Observable, of, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { makeRectangle } from './app/rectangle';
import { AppSources, initState } from './app/state';

function main(sources: AppSources) {
    const canvas$ = sources.DOM.select('#game');
    canvas$.element().take(1).subscribe({
        next: (canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            sources.GameWorker.output$.next([{ key: 'app', value: { canvas: offscreen } }, [offscreen]]);
        }
    });
    const addRect$ = from(canvas$.events('click') as any as Observable<MouseEvent>).pipe(
        map((e) => {
            const width = 5 + Math.random() * 20;
            const height = 5 + Math.random() * 20;
            return [{
                key: 'objects', value: makeRectangle(e.clientX - width / 2,
                    e.clientY - height / 2, width, height)
            }] as WorkerMessage;
        })
    );
    let paused = initState.paused;
    merge(
        from(canvas$.events('focus') as any).pipe(
            switchMap(() => from(canvas$.events('keydown') as any).pipe(
                takeUntil(from(canvas$.events('blur') as any)),
                filter((e: KeyboardEvent) => e.code === 'Space'),
                tap(() => paused = !paused),
                startWith(false),
                map((e) => [{ key: 'paused', value: paused }] as WorkerMessage)
            )),
        ),
        addRect$
    ).subscribe((args) => sources.GameWorker.output$.next(args));
    sources.DOM.select('#playerColor')
        .events('input')
        .map((e) => (e.target as any).value)
        .filter((value) => value && value.length === 7)
        .startWith(initState.player.color)
        .subscribe({
            next: (value) => sources.GameWorker.output$.next([{ key: 'player', value }])
        });
    return {
        DOM: combineLatest([
            of(canvas({ attrs: { id: 'game', width: 800, height: 600, tabindex: 0 } })),
            of(div([
                input({ attrs: { id: 'playerColor', value: initState.player.color } })
            ])),
            sources.GameWorker.input$.pipe(
                map((state: any) => state.fps),
                distinctUntilChanged(),
                startWith(''),
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
