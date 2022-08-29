import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeFeatureConstant, makeFeatureObservable, makeGameEngineDriver, makeGameEngineOptions, makeRenderer } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { distinctUntilKeyChanged, EMPTY, filter, ignoreElements, map, merge, mergeMap, of, switchMap, tap } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeAddRandomRect$, updateMovement } from './app/objects';
import { makeCreateRect } from './app/rectangle';
import { makeRender } from './app/render';
import { WorkerSources } from './app/state';

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
        filter((contact) => contact.touching === 1),
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
    const player$ = merge(
        sources.GameEngine.action$.playerColor.pipe(
            map((color: string) => {
                player.color = color;
                return player;
            })
        ),
        sources.GameEngine.update$.pipe(
            tap((delta) => updateMovement(delta, player, app)),
            ignoreElements()
        )
    );
    const objects$ = sources.GameEngine.action$.objects.pipe(
        mergeMap(({ x, y }) => addRandomRect$(x, y)),
    )
    return {
        GameEngine: {
            runtime$: merge(
                of(makeFeatureConstant('app', app)),
                of(makeFeatureFps(sources.GameEngine)),
                of(makeFeatureObservable('objects', objects$, objects)),
                of(makeFeatureObservable('paused', sources.GameEngine.action$.paused)),
                of(makeFeatureConstant('grounds', grounds)),
                of(makeFeatureObservable('player', player$))
            ),
            reflector$: of(({ fps, objects }) => {
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
            renderer$: sources.GameEngine.action$.engine.pipe(
                filter((action) => isEngineActionCanvas(action)),
                map(({ payload }) => makeRenderer(makeRender(payload)))
            )
        },
        World: sources.GameEngine.state$.pipe(
            distinctUntilKeyChanged('paused'),
            map((state: any) => state.paused),
            switchMap((paused) => paused ? EMPTY : sources.GameEngine.update$)
        )
    };
}

let options = makeGameEngineOptions(self, ['app', 'objects', 'paused', 'playerColor']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver()
});
