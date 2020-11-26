import { Reducer, Store } from "redux";
import { OgodStateEngine } from "./engine/state";

export interface OgodStore<S extends OgodStateEngine = OgodStateEngine> extends Store<S> {
    asyncReducers: { [id: string]: Reducer };
    injectReducer: (id: string, reducer: Reducer) => void;
}
