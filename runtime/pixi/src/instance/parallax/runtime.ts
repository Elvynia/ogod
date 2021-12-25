import { OgodActionInstance } from '@ogod/common';
import { Container, TilingSprite } from 'pixi.js';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PixiStateEngine } from '../../engine/state';
import { PixiStateTextures } from '../../resource/textures/state';
import { PixiRuntimeInstance, waitForResource } from '../default/runtime';
import { PixiStateParallax } from './state';

export class PixiRuntimeParallax extends PixiRuntimeInstance {

    initializeSprite(state: PixiStateParallax, state$: Observable<PixiStateEngine>): Observable<PixiStateParallax> {
        return waitForResource<PixiStateTextures>(state, state$).pipe(
            map((textures) => ({
                ...state,
                resource$: textures,
                instance$: new Container()
            })),
            tap((initState) => initState.resource$
                .map((texture) => new TilingSprite(texture, initState.width, initState.height))
                .forEach((sprite, i) => initState.instance$.addChildAt(sprite, i))
            )
        );
    }

    update(delta: number, state: PixiStateParallax) {
        if (state.speed && state.speed !== 0) {
            state.instance$.children.slice().reverse().forEach((child: TilingSprite, i) => {
                child.tilePosition.x += ((state.speed * state.ratio) / (i + state.speedFactor)) * delta / 1000;
            });
        }
    }

    destroy(state: PixiStateParallax, state$: Observable<PixiStateEngine>): Observable<OgodActionInstance> {
        // FIXME: Options for children/textures.
        state.instance$.destroy();
        return super.destroy(state, state$);
    }
}
