import { OgodRuntimeReactive } from '../reactive/runtime';
import { OgodStateReactive, OgodActionActor, OgodCategoryState, OgodStateActor } from '@ogod/common';
import { Observable, Subscription } from 'rxjs';
import { tap, map, scan } from 'rxjs/operators';
import { OgodRuntimeEngine } from '../engine/runtime';

declare var self: OgodRuntimeEngine;

export type OgodUpdateFunction<S extends OgodStateActor<C>, C extends string = S['category']> = (delta: number, state: S) => void;

export function ogodReactiveUpdate<
    S extends OgodStateReactive<C>,
    A extends OgodActionActor<S>,
    C extends string = S['category']
>(runtime: OgodRuntimeReactive<S, A>, state: S): Subscription {
    let source: Observable<any> = self.update$.asObservable();
    let sub: Subscription;
    if (state.tick) {
        source = source.pipe(
            tap((delta) => runtime.update(delta, state))
        );
    }
    if (state.watches.length > 0 || state.reflects.length > 0) {
        source = source.pipe(
            map((delta) => [delta, state.watches.concat(state.reflects.filter((i) => !state.watches.includes(i)))
                .reduce((acc, key) => Object.assign(acc, { [key]: state[key] }), {})])
        );
        if (state.watches.length > 0) {
            source = source.pipe(
                scan((s1, [delta, s2]) => {
                    state.watches
                        .filter((up) => s1[up] !== s2[up])
                        .forEach((up) => {
                            const upFn = 'updateState' + up[0].toUpperCase() + (up.length > 1 ? up.substring(1) : '');
                            if (runtime[upFn]) {
                                runtime[upFn](delta, state);
                            }
                        });
                    return s2;
                }, { ...state })
            );
        } else {
            source = source.pipe(
                map(([_, s]) => s)
            );
        }
        if (state.reflects.length > 0) {
            sub = source.pipe(
                scan(([s1], s2) => {
                    const changes = state.reflects
                        .filter((ref) => s1[ref] !== s2[ref])
                        .map((ref) => ({ [ref]: s2[ref] }))
                        .reduce((acc, prop) => Object.assign(acc, prop), {});
                    return [s2, changes];
                }, [{ ...state }, {}]),
                map(([s, changes]) => changes)
            ).subscribe((update) => self.reflect$.next({ id: state.id, state: update }));
        }
    }
    if (!sub) {
        sub = source.subscribe();
    }
    return sub;
}