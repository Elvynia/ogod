import 'symbol-observable';

import { canvas, div, h3, input, MainDOMSource, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';
import { GameEngineSource, makeFeature, makeGameEngineDriver } from '@ogod/game-engine-driver';
import { combineLatest, distinctUntilChanged, filter, first, from, map, of } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeKeysDownPerFrame } from './app/inputs';
import { makeFeatureObjects } from './app/objects';
import { makeFeatureBooleanToggle } from './app/paused';
import { makeRectangle } from './app/rectangle';
import { AppState, initState } from './app/state';

interface AppSources {
    GameEngine: GameEngineSource<AppState>;
    DOM: MainDOMSource;
}

const makeRender = (canvas: HTMLCanvasElement) => {
    const ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>(canvas)).getContext('2d');
    return (state: any) => {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        state['objects'].forEach((obj: any) => {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });
        ctx.fillStyle = state.player.color;
        ctx.fillRect(state.player.position.x, state.player.position.y, 15, 25);
    };
}

export function makeFeatureConstant(engine: GameEngineSource<any>, key: string) {
    return engine.state$.pipe(
        first(),
        map((state) => key.includes('.') ? key.split('.').reduce((prev, cur) => prev[cur], state) : state[key])
    );
}

function main(sources: AppSources) {
    const keysDownPerFrame$ = makeKeysDownPerFrame(sources.GameEngine.frame$);
    const canvas$ = sources.DOM.select('#game');
    canvas$.element().take(1).subscribe({
        next: (canvas: HTMLCanvasElement) => {
            const render = makeRender(canvas);
            sources.GameEngine.game$.subscribe((state) => {
                // console.log('RENDERING');
                render(state);
            });
            // }, null, () => console.log('Game completed !'));
        }
    });
    canvas$.events('click').subscribe({
        next: (event: MouseEvent) => {
            const width = 5 + Math.random() * 20;
            const height = 5 + Math.random() * 20;
            sources.GameEngine.state$.pipe(first()).subscribe((state) =>
                sources.GameEngine.state$.next({
                    ...state,
                    objects: [...state.objects, makeRectangle(event.clientX - width / 2,
                        event.clientY - height / 2, width, height)]
                })
            );
        }
    });
    const playerColor$ = sources.DOM.select('#playerColor')
        .events('input')
        .map((e) => (e.target as any).value)
        .filter((value) => value && value.length === 7)
        .startWith(initState.player.color);
    return {
        GameEngine: of({
            app: makeFeatureConstant(sources.GameEngine, 'app'),
            objects: makeFeatureObjects(sources.GameEngine),
            paused: makeFeatureBooleanToggle(sources.GameEngine, 'paused', keysDownPerFrame$.pipe(
                filter((inputState) => inputState['spacebar'] === 'Space')
            )),
            player: makeFeature(of({
                color: from(playerColor$ as any),
                position: makeFeatureConstant(sources.GameEngine, 'player.position')
            }))
        }),
        DOM: combineLatest([
            of(canvas({ props: { id: 'game', width: 800, height: 600 } })),
            of(div([
                input({ props: { id: 'playerColor', value: initState.player.color } })
            ])),
            makeFeatureFps(sources).pipe(
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
    GameEngine: makeGameEngineDriver(initState),
    DOM: makeDOMDriver('#app')
});
window.onunload = (e) => dispose();
// timer(5000).subscribe(() => dispose());
