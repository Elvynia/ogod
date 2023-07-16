import { makeStateObject } from "@ogod/driver-engine";
import { makeFeatureSwitch } from "@ogod/examples-common";
import { Observable, concat, filter, first, of, race, switchMap, takeUntil, tap } from "rxjs";
import { makeFeatureMapLoad } from "../map/make";
import { PHASE } from '../phase/state';
import { makeFeatureShapesLoad, makeFeatureShapesUpdate } from "../shape/make";
import { makePlayerPosition } from "../shape/player/make";
import { AppState, WorkerSources } from "../state";

function makeLevelLoad(sources: WorkerSources) {
    return makeStateObject({
        key$: of(
            makeFeatureShapesLoad(sources),
            makeFeatureMapLoad(sources)
        ),
        state: sources.Engine.state$.pipe(
            filter((s) => s.phase == PHASE.LOAD),
            first()
        )
    }).pipe(
        tap({
            complete: () => sources.Engine.state$.pipe(
                filter((s) => Object.keys(s.loading).length === 0),
                first()
            ).subscribe(() => sources.Engine.action$.getHandler('phase').next(PHASE.PLAY))
        })
    );
}

function makeLevelPlay(sources: WorkerSources) {
    return makeStateObject({
        key$: of(
            makeFeatureShapesUpdate(sources),
            makeFeatureSwitch({
                key: 'paused',
                action$: sources.Engine.action$.getHandler('paused'),
                state$: sources.Engine.state$
            })
        ),
        state: sources.Engine.state$.pipe(
            first()
        )
    }).pipe(
        takeUntil(sources.Engine.state$.pipe(
            first(),
            switchMap((state) => race(
                sources.Engine.engine$.pipe(
                    filter(() => state.shapes.player.grounded && state.shapes.player.worldX > state.map.width * state.map.scale - 25),
                    first(),
                    tap(() => sources.Engine.action$.getHandler('phase').next(PHASE.END))
                ),
                sources.Engine.engine$.pipe(
                    filter(() => state.shapes.player.worldY < -100),
                    first(),
                    tap(() => sources.Engine.action$.getHandler('phase').next(PHASE.GAMEOVER))
                )
            ))
        ))
    );
}

const VELOCITY_DEFAULT = { x: 0, y: 0 };
function makeLevelRestartOrNext(sources: WorkerSources, levelHolder: { makeLevel: () => Observable<AppState> }): Observable<AppState> {
    return sources.Engine.state$.pipe(
        first(),
        switchMap((state) => {
            if (state.phase == PHASE.GAMEOVER) {
                state.shapes.player.body.SetTransformVec(makePlayerPosition(), 0);
                state.shapes.player.body.SetLinearVelocity(VELOCITY_DEFAULT);
                Object.assign(state.shapes.player, makePlayerPosition(sources.World.scale));
                sources.Engine.action$.getHandler('phase').next(PHASE.PLAY);
                return concat(
                    makeLevelPlay(sources),
                    makeLevelRestartOrNext(sources, levelHolder)
                );
            } else {
                Object.values(state.map.platforms).forEach((p) => sources.World.instance.DestroyBody(p.body))
                sources.World.instance.DestroyBody(state.shapes.player.body);
                state.map.platforms = {};
                state.map.width += 5;
                ++state.map.level;
                sources.Engine.action$.getHandler('phase').next(PHASE.START);
                return levelHolder.makeLevel();
            }
        })
    );
}

export function makeLevel(sources: WorkerSources): Observable<AppState> {
    let levelHolder = { makeLevel: undefined };
    levelHolder.makeLevel = () => concat(
        makeLevelLoad(sources),
        makeLevelPlay(sources),
        makeLevelRestartOrNext(sources, levelHolder)
    );
    return levelHolder.makeLevel();
}
