import { BehaviorSubject, Subject } from "rxjs";
import { Stream } from "xstream";
import { RuntimeState } from '../runtime/state';
import { frame$ } from '../frame/observable';
import { makeGame } from "../game/observable";
import { GameState } from '../game/state';
import { GameEngineSource } from './driver';

export function makeGameEngineDriver<S extends GameState>(initState?: S) {
    return function gameEngineDriver(sinks: Stream<RuntimeState<S>>): GameEngineSource<S> {
        const state$ = new BehaviorSubject<S>(initState!);
        const game$ = makeGame(sinks, state$);
        return {
            dispose: () => {
                console.log('Stopping game engine');
                state$.complete();
            },
            frame$,
            state$,
            action$: new Subject(),
            game$
        };
    };
}

