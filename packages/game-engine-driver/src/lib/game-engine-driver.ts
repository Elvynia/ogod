import { BehaviorSubject, Subject } from "rxjs";
import { Stream } from "xstream";
import { frame$ } from "./frame";
import { makeGame } from "./game";

export function makeGameEngineDriver(initState?: any) {
    return function gameEngineDriver(sinks: Stream<any>): any {
        const state$ = new BehaviorSubject(initState);
        return {
            frame$,
            state$,
            action$: new Subject(),
            game$: makeGame(sinks, state$)
        };
    };
}
