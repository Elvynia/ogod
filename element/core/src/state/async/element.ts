import { BehaviorSubject } from "rxjs";
import { AsyncState } from "../../factory/async";

export interface OgodElementAsync<S> extends HTMLElement {
    category: string;
    initialize$: BehaviorSubject<AsyncState>;
    key: string;
    state: S;
}
