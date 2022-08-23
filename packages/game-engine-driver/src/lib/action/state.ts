import { Subject } from "rxjs";

export type ActionState<A> = {
    [key in keyof A]: Subject<any>;
};

export type ActionHandler<A> = ActionState<A> & {
    // engine: Subject<EngineAction>;
    close: Subject<void>;
};
