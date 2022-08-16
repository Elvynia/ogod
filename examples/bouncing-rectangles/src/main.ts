import { canvas, div, h3, input, MainDOMSource, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { combineLatest, distinctUntilChanged, filter, map, of } from 'rxjs';
import { makeKeysDownPerFrame } from './app/inputs';
import { makeRectangle } from './app/rectangle';
import { initState } from './app/state';


interface AppSources {
    // GameEngine: GameEngineSource<AppState>;
    DOM: MainDOMSource;
}

function main(sources: AppSources) {
    const worker = new Worker(new URL('worker.ts', import.meta.url));
    const canvas$ = sources.DOM.select('#game');
    canvas$.element().take(1).subscribe({
        next: (canvas: any) => {
            const offscreen = canvas.transferControlToOffscreen();
            worker.postMessage({ key: 'app', value: { canvas: offscreen } }, [offscreen]);
        }

    });
    canvas$.events('click').subscribe({
        next: (event: MouseEvent) => {
            const width = 5 + Math.random() * 20;
            const height = 5 + Math.random() * 20;
            worker.postMessage({
                key: 'objects', value: makeRectangle(event.clientX - width / 2,
                    event.clientY - height / 2, width, height)
            })
        }
    });
    makeKeysDownPerFrame().pipe(
        filter((inputs) => inputs['spacebar'] === 'Space')
    ).subscribe(() => worker.postMessage({ key: 'paused' }));
    const playerColor$ = sources.DOM.select('#playerColor')
        .events('input')
        .map((e) => (e.target as any).value)
        .filter((value) => value && value.length === 7)
        .startWith(initState.player.color)
        .subscribe({
            next: (value) => worker.postMessage({ key: 'player', value })
        });
    return {
        // GameEngine: ,
        DOM: combineLatest([
            of(canvas({ props: { id: 'game', width: 800, height: 600 } })),
            of(div([
                input({ props: { id: 'playerColor', value: initState.player.color } })
            ])),
            // makeFeatureFps(sources).pipe(
            of(60).pipe(
                map((fps) => Math.round(fps)),
                distinctUntilChanged(),
                map((fps) => h3('FPS: ' + fps))
            )
        ]).pipe(
            map(([canvas, p, fps]) => div([canvas, div({ class: { content: true } }, [p, fps])]))
        )
    };
}

const dispose = run(main, {
    DOM: makeDOMDriver('#app')
});
window.onunload = (e) => dispose();
// timer(5000).subscribe(() => dispose());
