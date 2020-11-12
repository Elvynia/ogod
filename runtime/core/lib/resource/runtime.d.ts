import { OgodStateEngine, OgodStateResource, OgodActionResource } from '@ogod/common';
import { Observable } from 'rxjs';
import { OgodRuntimeActor } from '../actor/runtime';
export interface OgodRuntimeResource extends OgodRuntimeActor<OgodStateResource, OgodActionResource> {
}
export declare class OgodRuntimeResourceDefault implements OgodRuntimeResource {
    initialize(state: OgodStateResource, state$: Observable<OgodStateEngine>): Observable<OgodActionResource>;
    destroy({ id }: OgodStateResource): Observable<OgodActionResource>;
}
