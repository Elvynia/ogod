import { Observable } from "redux";
import { AsyncState } from "../../factory/async";
import { OgodStateActor, OgodCategoryState } from "@ogod/common";

export interface OgodElementState<C extends string> extends HTMLElement {
    initialize$: Observable<AsyncState>;
    state$: Observable<OgodStateActor<C>>;
    state: OgodStateActor<C>;
}
