import { BehaviorSubject, Subject } from "rxjs";
import { Stream } from "xstream";
import { makeActionState } from "../action/make";
import { FeatureState } from "../feature/state";
import { frame$ } from '../frame/observable';
import { makeGame } from "../game/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineSource } from './state';

export function makeGameEngineDriver<S extends FeatureState>(initState?: S) {
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
            actions: makeActionState(initState!),
            game$
        };
    };
}
