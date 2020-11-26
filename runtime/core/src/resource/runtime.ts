import { OgodStateEngine, OgodStateResource, OgodActionResource, resourceInitSuccess, resourceChangesSuccess, resourceDestroySuccess } from '@ogod/common';
import { Observable, of } from 'rxjs';
import { OgodRuntimeActor } from '../actor/runtime';

export interface OgodRuntimeResource extends OgodRuntimeActor<OgodStateResource, OgodActionResource> {
}

export class OgodRuntimeResourceDefault implements OgodRuntimeResource {

    initialize(state: OgodStateResource, state$: Observable<OgodStateEngine>): Observable<OgodActionResource> {
        return of(resourceInitSuccess({
            id: state.id,
            state: {
                ...state,
                loading: false,
                loaded: true
            }
        }));
    }

    changes(changes: Partial<OgodStateResource>, state: OgodStateResource): Observable<OgodActionResource> {
        return of(resourceChangesSuccess({
            id: state.id,
            changes
        }));
    }

    destroy({ id }: OgodStateResource): Observable<OgodActionResource> {
        return of(resourceDestroySuccess({ id }));
    }

}
