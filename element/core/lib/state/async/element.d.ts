import { BehaviorSubject } from "rxjs";
import { AsyncState } from "../../factory/async";
export interface OgodElementAsync<S> extends HTMLElement {
    initialize$: BehaviorSubject<AsyncState>;
    state: S;
}
