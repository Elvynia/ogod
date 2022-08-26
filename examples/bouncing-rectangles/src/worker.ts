import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { distinctUntilKeyChanged, EMPTY, filter, ignoreElements, map, merge, mergeMap, of, startWith, switchMap, tap } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeAddRandomRect$, updateMovement } from './app/objects';
import { makeCreateRect } from './app/rectangle';
import { makeRender } from './app/render';
import { AppActions, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    const app = {
        width: 800,
        height: 600,
        scale: 10
    };
    const createRect = makeCreateRect(app, sources.World.instance);
    const player = createRect(400, 400, 15, 25);
    const grounds = [
        createRect(400, 5, 600, 10, false, 50),
        createRect(5, 300, 400, 10, false, 50, Math.PI / 2),
        createRect(795, 300, 400, 10, false, 50, Math.PI / 2),
        createRect(400, 595, 600, 10, false, 50),
    ];
    const objects = {};
    const addRandomRect$ = makeAddRandomRect$(sources.GameEngine, createRect, sources.World.instance, objects, app);
    sources.World.contact$.pipe(
        filter((contact) => contact.touching),
        map(({ idA, idB }) => {
            const ids = [];
            if (objects[idA]) {
                ids.push(idA)
            }
            if (objects[idB]) {
                ids.push(idB);
            }
            return ids;
        })
    ).subscribe((ids: string[]) => ids.forEach((id) => --objects[id].health));
    return {
        GameEngine: of({
            app,
            fps$: makeFeatureFps(sources.GameEngine),
            objects$: sources.GameEngine.action$.objects.pipe(
                mergeMap(({ x, y }) => addRandomRect$(x, y)),
                startWith(objects)
            ),
            paused$: sources.GameEngine.action$.paused.asObservable(),
            grounds,
            player$: merge(
                sources.GameEngine.action$.playerColor.pipe(
                    map((color) => {
                        player.color = color;
                        return player;
                    })
                ),
                sources.GameEngine.update$.pipe(
                    tap((delta) => updateMovement(delta, player, app)),
                    ignoreElements()
                )
            )
        }),
        World: sources.GameEngine.state$.pipe(
            distinctUntilKeyChanged('paused'),
            map((state) => state.paused),
            switchMap((paused) => paused ? EMPTY : sources.GameEngine.update$)
        )
    };
}

let options = {
    ...makeGameEngineOptions<AppState, AppActions>(['app', 'objects', 'paused', 'playerColor']),
    workerContext: self,
    reflectHandler: of(({ fps, objects }) => {
        const values = Object.values(objects);
        return {
            fps,
            objectCount: values.length,
            objects: values.map(({ id, x, y, width, height, health, body }) => ({
                id,
                x,
                y,
                width,
                height,
                health,
                angle: -body.GetAngle()
            }))
        };
    }),
    makeRender
}
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver()
});
