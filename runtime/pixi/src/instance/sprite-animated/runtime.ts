import { PixiStateSpriteAnimated } from "./state";
import { PixiStateSpritesheet } from "../../resource/spritesheet/state";
import { waitForResource } from "../default/runtime";
import { filter, first, map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { OgodStateEngine } from "@ogod/common";
import { PixiRuntimeSprite } from "../sprite/runtime";

export class PixiRuntimeSpriteAnimated extends PixiRuntimeSprite {

    initializeSprite(state: PixiStateSpriteAnimated, state$: Observable<OgodStateEngine>): Observable<PixiStateSpriteAnimated> {
        return waitForResource<PixiStateSpritesheet>(state, state$).pipe(
            switchMap((data) => state$.pipe(
                map((fs) => fs.instance[state.id] as PixiStateSpriteAnimated),
                filter((initState) => initState && !!initState.animation),
                first(),
                map((initState) => ({
                    ...initState,
                    resource$: data
                }))
            )),
            map((initState) => ({
                ...initState,
                instance$: new PIXI.AnimatedSprite(this.getAnimation(initState), false)
            }))
        );
    }

    initializeProperties(state: PixiStateSpriteAnimated) {
        super.initializeProperties(state);
        this.updateStateLoop(0, state);
        this.updateStateAnimation(0, state);
        this.updateStatePlaying(0, state);
    }

    update(delta: number, state: PixiStateSpriteAnimated) {
        if (state.instance$.playing) {
            state.instance$.update(state.duration != null ? delta / (state.duration / state.instance$.textures.length) : 1);
        }
    }

    updateStateLoop(_, state: PixiStateSpriteAnimated) {
        state.instance$.loop = state.loop;
    }

    updateStateAnimation(_, state: PixiStateSpriteAnimated) {
        if (state.instance$.playing) {
            state.instance$.stop();
        }
        state.instance$.textures = this.getAnimation(state);
        if (state.playing) {
            state.instance$.play();
        }
    }

    updateStatePlaying(_, state: PixiStateSpriteAnimated) {
        if (state.playing && !state.instance$.playing) {
            state.instance$.play();
        } else if (!state.playing && state.instance$.playing) {
            state.instance$.stop();
        }
    }

    protected getAnimation(state: PixiStateSpriteAnimated): PIXI.Texture[] {
        const textures: PIXI.Texture[] = state.resource$.animations[state.animation];
        if (!textures) {
            console.warn('Wrong animation name %s not found in resource %s', state.animation, state.resource);
        }
        if (state.durations != null) {
            if (state.durations.length === textures.length) {
                return textures.map((texture, i) => ({
                    texture,
                    time: state.durations[i]
                } as any))
            } else {
                console.error(`Wrong number of frame durations : ${state.durations.length} (animation has ${textures.length})`)
                // Throw error.
            }
        } else {
            return textures;
        }
    }
}
