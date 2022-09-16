import { makeFeature$ } from '@ogod/game-engine-driver';
import { makeWorkerMessage } from "@ogod/game-worker-driver";
import { distinctUntilChanged, filter, fromEvent, map, merge, startWith, tap } from "rxjs";
import { AppState, WorkerSources } from '../state';
import { Controls, KeyState } from "./state";

export function makeControl$(controls: Controls<any>, key: string, code: string) {
    return merge(
        fromEvent(document, 'keydown').pipe(
            filter((e: KeyboardEvent) => e.code === code),
            map(() => true)
        ),
        fromEvent(document, 'keyup').pipe(
            filter((e: KeyboardEvent) => e.code === code),
            map(() => false)
        )
    ).pipe(
        distinctUntilChanged(),
        tap((value) => controls[key] = value)
    );
}

export function makeControls$<S extends KeyState>(keyState: S, controls: Controls<S> = {} as Controls<S>) {
    return merge(...Object.keys(keyState).map((k) => makeControl$(controls, k, keyState[k]))).pipe(
        startWith(undefined),
        map(() => makeWorkerMessage({ key: 'controls', value: controls }))
    );
}

export function makeFeatureControls(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'controls',
        value$: sources.GameEngine.actions.controls.pipe(
            startWith({})
        ),
        target,
        remove: true
    });
}
