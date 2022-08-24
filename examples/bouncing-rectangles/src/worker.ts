import { b2World } from '@box2d/core';
import run from '@cycle/run';
import { GameEngineOptions, GameEngineSource } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { distinctUntilKeyChanged, EMPTY, filter, ignoreElements, map, merge, mergeMap, of, startWith, switchMap, tap } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeAddRandomRect$, updateMovement } from './app/objects';
import { makeCreateRect } from './app/rectangle';
import { makeRender } from './app/render';
import { AppActions, AppState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource<AppState, AppActions> }) {
    const world = b2World.Create({ x: 0, y: 0 });
    world.SetContactListener({
        BeginContact(contact) {
            const idA = contact.GetFixtureA().GetBody().GetUserData();
            const idB = contact.GetFixtureB().GetBody().GetUserData();
            sources.GameEngine.action$.contact.next({
                idA,
                idB,
                touching: true
            });
        },
        EndContact(contact) {
            const idA = contact.GetFixtureA().GetBody().GetUserData();
            const idB = contact.GetFixtureB().GetBody().GetUserData();
            sources.GameEngine.action$.contact.next({
                idA,
                idB,
                touching: false
            });
        },
        PreSolve() { },
        PostSolve() { }
    });
    const app = {
        width: 800,
        height: 600,
        scale: 10
    };
    const createRect = makeCreateRect(app, world);
    const player = createRect(400, 400, 15, 25);
    const grounds = [
        createRect(400, 5, 600, 10, false, 50),
        createRect(5, 300, 400, 10, false, 50, Math.PI / 2),
        createRect(795, 300, 400, 10, false, 50, Math.PI / 2),
        createRect(400, 595, 600, 10, false, 50),
    ];
    const objects = {};
    const addRandomRect$ = makeAddRandomRect$(sources.GameEngine, createRect, world, objects, app);
    sources.GameEngine.action$.contact.pipe(
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
    sources.GameEngine.state$.pipe(
        distinctUntilKeyChanged('paused'),
        map((state) => state.paused),
        switchMap((paused) => paused ? EMPTY : sources.GameEngine.update$)
    ).subscribe((delta) => {
        world.Step(delta, {
            velocityIterations: 6,
            positionIterations: 2
        });
    });
    return {
        GameEngine: of({
            app,
            fps$: makeFeatureFps(sources.GameEngine),
            objects$: sources.GameEngine.action$.objects.pipe(
                mergeMap(({ x, y }) => addRandomRect$(x, y)),
                startWith(objects)
            ),
            paused$: sources.GameEngine.action$.paused,
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
        })
    };
}

let options = {
    ...makeGameEngineOptions<AppState, AppActions>(['app', 'objects', 'paused', 'playerColor', 'contact']),
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
} as GameEngineOptions<AppState>
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(options)
});
