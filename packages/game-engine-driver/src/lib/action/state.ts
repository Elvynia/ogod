import { FeatureState } from "@ogod/game-engine-driver";
import { Subject } from "rxjs";

export type ActionState<S extends FeatureState> = {
    [K in keyof S]: Subject<any>;
} & {
    select(key: keyof S): Subject<any>;
};
