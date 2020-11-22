import { Subscription } from 'rxjs';
import { OgodStateActor } from '../actor/state';
import { OgodCategoryState } from '../util/category';

export interface OgodStateReactive<C extends keyof OgodCategoryState> extends OgodStateActor<C> {
    active: boolean;
    running: boolean;
    tick: boolean;
    updates: Array<string>;
    watches: Array<string>;
    reflects: Array<string>;
    sub$: { [id: string]: Subscription };
}
