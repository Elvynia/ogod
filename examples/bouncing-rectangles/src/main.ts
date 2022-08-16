import { canvas, div, h3, input, MainDOMSource, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { GameEngineWorker, makeGameEngineWorker } from '@ogod/game-engine-worker';
import { combineLatest, distinctUntilChanged, filter, map, of, startWith } from 'rxjs';
import { makeKeysDownPerFrame } from './app/inputs';
import { makeRectangle } from './app/rectangle';
import { AppState, initState } from './app/state';


interface AppSources {
    GameWorker: GameEngineWorker<AppState>;
    DOM: MainDOMSource;
}

function main(sources: AppSources) {
    const canvas$ = sources.DOM.select('#game');
    canvas$.element().take(1).subscribe({
        next: (canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            sources.GameWorker.output$.next([{ key: 'app', value: { canvas: offscreen } }, [offscreen]]);
        }

    });
    canvas$.events('click').subscribe({
        next: (event: MouseEvent) => {
            const width = 5 + Math.random() * 20;
            const height = 5 + Math.random() * 20;
            sources.GameWorker.output$.next([{
                key: 'objects', value: makeRectangle(event.clientX - width / 2,
                    event.clientY - height / 2, width, height)
            }]);
        }
    });
    makeKeysDownPerFrame().pipe(
        filter((inputs) => inputs['spacebar'] === 'Space')
    ).subscribe(() => sources.GameWorker.output$.next([{ key: 'paused' }]));
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
            of(canvas({ props: { id: 'game', width: 800, height: 600 } })),
            of(div([
                input({ props: { id: 'playerColor', value: initState.player.color } })
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
// timer(5000).subscribe(() => dispose());
