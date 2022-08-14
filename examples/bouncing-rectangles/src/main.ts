import { run } from '@cycle/run';
import { makeGameEngineDriver } from '@ogod/game-engine-driver';
import { bufferCount, combineLatest, distinctUntilChanged, distinctUntilKeyChanged, filter, first, map, of, pairwise, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import 'symbol-observable';
import { makeKeysDownPerFrame } from './app/inputs';
import { clampMag, runBoundaryCheck } from './app/util';

const boundaries = {
    left: 0,
    top: 0,
    bottom: 300,
    right: 400,
};
const bounceRateChanges = {
    left: 1.1,
    top: 1.2,
    bottom: 1.3,
    right: 1.4,
};
const baseObjectVelocity = {
    x: 30,
    y: 40,
    maxX: 250,
    maxY: 200,
};

const gameArea: HTMLElement = document.getElementById('game');
const fps: HTMLElement = document.getElementById('fps');
const render = (state: any) => {
    const ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>(
        gameArea
    )).getContext('2d');
    ctx.clearRect(0, 0, gameArea.clientWidth, gameArea.clientHeight);
    state['objects'].forEach((obj: any) => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
};

const objectUpdates$ = (sources: any) => combineLatest(
    sources.GameEngine.state$.pipe(
        map((state: any) => state.objects),
        distinctUntilChanged(),
        // tap((objects) => console.log('Objects array has changed !', objects)),
        switchMap((objects: any[]) => objectUpdateMovement$(sources)(selectorMovement(objects)).pipe(map(() => objects)))
    )
).pipe(map(([objects]) => objects));

const objects$ = (sources: any) => sources.GameEngine.state$.pipe(
    distinctUntilKeyChanged('paused'),
    pairwise(),
    filter(([a, b]) => a.paused !== b.paused),
    tap(([_, state]) =>
        state.objects.forEach((obj) => {
            let newColor = obj.toggleColor;
            obj.toggleColor = obj.color;
            obj.color = newColor;
        })
    ),
    startWith([undefined, sources.GameEngine.state$.value]),
    switchMap(([_, b]) => (b.paused ? of(b.objects) : objectUpdates$(sources)))
);

const selectorMovement = (objects: any[]) => objects.filter((o) => o.velocity);
const updateMovement = (deltaTime, obj) => {
    obj.x = obj.x += obj.velocity.x * deltaTime;
    obj.y = obj.y += obj.velocity.y * deltaTime;
    const didHit = runBoundaryCheck(obj, boundaries);
    if (didHit) {
        if (didHit === 'right' || didHit === 'left') {
            obj.velocity.x *= -bounceRateChanges[didHit];
        } else {
            obj.velocity.y *= -bounceRateChanges[didHit];
        }
    }
    obj.velocity.x = clampMag(obj.velocity.x, 0, baseObjectVelocity.maxX);
    obj.velocity.y = clampMag(obj.velocity.y, 0, baseObjectVelocity.maxY);
};

const objectUpdateMovement$ = (sources) => (selection: any[]) =>
    sources.GameEngine.frame$.pipe(
        map((delta) => {
            selection.forEach((o) => updateMovement(delta, o));
            return selection;
        })
    );

const addRectangleHandler = (sources) => document
    .querySelector('#game')
    .addEventListener('click', (event: MouseEvent) => {
        sources.GameEngine.state$.pipe(first()).subscribe(({ objects, paused }) =>
            sources.GameEngine.state$.next({
                objects: [
                    ...objects,
                    {
                        x: 200,
                        y: 50,
                        width: 15,
                        height: 20,
                        toggleColor: '#FF0000',
                        color: '#0000FF',
                        velocity: { ...baseObjectVelocity },
                    },
                ],
                paused,
            })
        );
    });

let running = false;
function main(sources) {
    const keysDownPerFrame$ = makeKeysDownPerFrame(sources.GameEngine.frame$);
    sources.GameEngine.game$.pipe(
        first()
    ).subscribe((state) => {
        console.debug('Running game with state: ', state);
        running = true;
    });
    const renderSub = sources.GameEngine.game$.subscribe((state) => {
        render(state);
    });
    sources.GameEngine.frame$
        .pipe(
            bufferCount(10),
            map((frames: number[]) => {
                const total = frames.reduce((acc, curr) => {
                    acc += curr;
                    return acc;
                }, 0);

                return 1 / (total / frames.length);
            })
        )
        .subscribe((avg) => {
            fps.innerHTML = Math.round(avg) + '';
        });
    addRectangleHandler(sources);
    return {
        GameEngine: of({
            objects: objects$(sources),
            paused: keysDownPerFrame$.pipe(
                withLatestFrom(sources.GameEngine.state$),
                map(([inputState, state]: [any, any]) =>
                    inputState['spacebar'] === 'Space' ? !state.paused : state.paused
                ),
                distinctUntilChanged(),
                startWith(false)
            )
        })
    };
}

const initState = {
    objects: [{
        x: 10,
        y: 10,
        width: 20,
        height: 30,
        toggleColor: '#FF0000',
        color: '#000000',
        velocity: { ...baseObjectVelocity },
    }, {
        x: 200,
        y: 249,
        width: 50,
        height: 20,
        toggleColor: '#00FF00',
        color: '#0000FF',
        velocity: { x: -baseObjectVelocity.x, y: 2 * baseObjectVelocity.y },
    }],
    paused: false
};

run(main, {
    GameEngine: makeGameEngineDriver(initState)
});
