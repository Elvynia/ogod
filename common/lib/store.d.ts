import { Reducer, Store } from "redux";
import { OgodStateEngine } from "./engine/state";
export interface OgodStore extends Store<OgodStateEngine> {
    asyncReducers: {
        [id: string]: Reducer;
    };
    injectReducer: (id: string, reducer: Reducer) => void;
}
