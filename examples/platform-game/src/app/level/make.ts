import { makeStateObject } from "@ogod/game-engine-driver";
import { Observable, concat, filter, first, of, race, switchMap, takeUntil, tap } from "rxjs";
import { makeFeatureCameraUpdate } from "../camera/make";
import { makeFeatureMapLoad } from "../map/make";
import { makeFeaturePaused } from "../paused/make";
import { PHASE } from '../phase/state';
import { makeFeatureShapesLoad, makeFeatureShapesUpdate } from "../shape/make";
import { PLAYER_INIT_POS_BODY } from "../shape/player/make";
import { AppState, WorkerSources } from "../state";
import { PLAYER_INIT_POS } from './../shape/player/make';

function makeLevelLoad(sources: WorkerSources) {
    return makeStateObject({
        key$: of(
            makeFeatureShapesLoad(sources),
            makeFeatureMapLoad(sources)
        ),
        state: sources.GameEngine.state$.pipe(
            filter((s) => s.phase == PHASE.LOAD),
            first()
        )
    }).pipe(
        tap({
            complete: () => sources.GameEngine.action$.getHandler('phase').next(PHASE.PLAY)
        })
    );
}

function makeLevelPlay(sources: WorkerSources) {
    return makeStateObject({
        key$: of(
            makeFeatureShapesUpdate(sources),
            makeFeatureCameraUpdate(sources),
            makeFeaturePaused(sources)
        ),
        state: sources.GameEngine.state$.pipe(
            first()
        )
    }).pipe(
        takeUntil(race(
            sources.GameEngine.game$.pipe(
                filter(([_, s]) => s.shapes.player.grounded && s.shapes.player.x > s.map.width * s.map.scale - 25),
                first(),
                tap(() => sources.GameEngine.action$.getHandler('phase').next(PHASE.END))
            ),
            sources.GameEngine.game$.pipe(
                filter(([_, s]) => s.shapes.player.body.GetPosition().y < -1),
                first(),
                tap(() => sources.GameEngine.action$.getHandler('phase').next(PHASE.GAMEOVER))
            )
        ))
    );
}

const VELOCITY_DEFAULT = { x: 0, y: 0 };
function makeLevelRestartOrNext(sources: WorkerSources, levelHolder: { makeLevel: () => Observable<AppState> }): Observable<AppState> {
    return sources.GameEngine.state$.pipe(
        first(),
        switchMap((state) => {
            if (state.phase == PHASE.GAMEOVER) {
                state.shapes.player.body.SetTransformVec(PLAYER_INIT_POS_BODY, 0);
                state.shapes.player.body.SetLinearVelocity(VELOCITY_DEFAULT);
                Object.assign(state.shapes.player, PLAYER_INIT_POS);
                sources.GameEngine.action$.getHandler('phase').next(PHASE.PLAY);
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
                sources.GameEngine.action$.getHandler('phase').next(PHASE.START);
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
