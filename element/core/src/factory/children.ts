import { Hybrids } from 'hybrids';
import { children } from 'hybrids';
import { ActionCreator, sceneChanges, instanceChanges, systemChanges } from "@ogod/common";
import { ogodDispatchChildChanges, OGOD_ASYNC_CHILD_CHANGES, dispatchAsyncChildReady } from './async';
import { from, merge, BehaviorSubject, forkJoin } from 'rxjs';
import { switchMap, filter, map } from 'rxjs/operators';

const updateReactiveChildState = (host, propName: string, multiple: boolean) => {
    const values = host[propName];
    if (multiple) {
        host.state[propName] = values.map((el) => el.state);
    } else {
        host.state[propName] = values.length ? values[0].state : null;
    }
}

export const ogodFactoryReactiveChildren = (category: string, changesCreator: ActionCreator, multiple: boolean = false, connect?) => {
    let propName;
    return {
        ...children((o: Hybrids<any>) => o.category === category),
        connect(host, key, invalidate) {
            propName = key;
            host.initialize$.next({
                ...host.initialize$.value,
                [propName]: false
            });
            const changeListener = (e) => {
                if (e.detail.referer === category) {
                    // console.log('changes in %s for child prop %s', host.id || host.category, propName, e);
                    // FIXME: Should not change state locally but wait sync back from changes success.
                    updateReactiveChildState(host, propName, multiple);
                    if (host.id && host.engine) {
                        host.engine.worker.postMessage(changesCreator({
                            id: host.id,
                            changes: {
                                [propName]: host.state[propName]
                            }
                        }));
                    } else {
                        ogodDispatchChildChanges(host, host.category, propName);
                    }
                }
            }
            const observer = new MutationObserver((e) => {
                invalidate();
                from(e).pipe(
                    switchMap((record) => merge(
                        from(record.addedNodes).pipe(
                            filter((node: any) => node.category != null),
                            map((node) => ({ node, removed: false }))
                        ),
                        from(record.removedNodes).pipe(
                            filter((node: any) => node.category != null),
                            map((node) => ({ node, removed: true }))
                        )
                    ))
                ).subscribe(({ node, removed }) => {
                    if (removed) {
                        node.removeEventListener(OGOD_ASYNC_CHILD_CHANGES, changeListener);
                    } else {
                        node.addEventListener(OGOD_ASYNC_CHILD_CHANGES, changeListener);
                    }
                });
            });
            observer.observe(host, {
                childList: true,
                subtree: false // FIXME: Externalize options
            });
            const disconnect = connect && connect(host, key, invalidate);
            return () => {
                observer.disconnect();
                if (disconnect) {
                    disconnect();
                }
            };
        },
        observe: (host, values: Array<any>, lastValue) => {
            if (!(host.initialize$ as BehaviorSubject<any>).isStopped) {
                forkJoin([...values.map((v) => v.initialize$)]).subscribe({
                    complete: () => {
                        updateReactiveChildState(host, propName, multiple);
                        dispatchAsyncChildReady(host, host.category, propName);
                    }
                });
            } else {
                console.warn('%s children %s changed (state changes not implemented!)', host.id || host.category, propName);
            }
        }
    }
}

export const ogodFactorySceneChildren = (category: string, multiple?: boolean, connect?) => ogodFactoryReactiveChildren(category, sceneChanges, multiple, connect);
export const ogodFactoryInstanceChildren = (category: string, multiple?: boolean, connect?) => ogodFactoryReactiveChildren(category, instanceChanges, multiple, connect);
export const ogodFactorySystemChildren = (category: string, multiple?: boolean, connect?) => ogodFactoryReactiveChildren(category, systemChanges, multiple, connect);
