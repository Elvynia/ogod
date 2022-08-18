import { FeatureState } from "@ogod/game-engine-driver";
import { Subject } from "rxjs";

export type ActionHandler<S extends FeatureState> = {
    [K in keyof S]: Subject<any>;
};

export type ActionState<S extends FeatureState> = ActionHandler<S> & {
    select(key: keyof S): Subject<any>;
    close: Subject<void>;
};
