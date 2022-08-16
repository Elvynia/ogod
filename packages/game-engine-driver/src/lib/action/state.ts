import { FeatureState } from "@ogod/game-engine-driver";
import { Subject } from "rxjs";

export interface WorkerAction {
    key: string;
    value?: any;
}

export type WorkerMessage = [WorkerAction, any[]?];

export type ActionState<S extends FeatureState> = {
    [K in keyof S]: Subject<any>;
} & {
    select(key: keyof S): Subject<any>;
};
