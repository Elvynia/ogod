import { ActionCreator, instanceChanges, sceneChanges, systemChanges } from "@ogod/common";
import { Hybrids } from 'hybrids';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { dispatchAsyncChildReady, ogodDispatchChildChanges, OGOD_ASYNC_CHILD_CHANGES } from './async';

const walkWithShadow = (node, fn, options, items = []) => {
    let children = [...node.children];
    if (node.shadowRoot) {
        children.push(...node.shadowRoot.children);
    }
    Array.from(children).forEach((child: any) => {
        const hybrids = child.constructor.hybrids;
        if (hybrids && fn(hybrids)) {
            items.push(child);
            if (options.deep && options.nested) {
                walkWithShadow(child, fn, options, items);
            }
        } else if (options.deep) {
            walkWithShadow(child, fn, options, items);
        }
    });
    return items;
}

export function ogodFactoryChildren(hybridsOrFn, connect?, options = { deep: false, nested: false }) {
    const fn =
        typeof hybridsOrFn === "function"
            ? hybridsOrFn
            : hybrids => hybrids === hybridsOrFn;
    return {
        get(host) {
            return walkWithShadow(host, fn, options);
        },
        connect(host, key, invalidate) {
            const observer = new MutationObserver(invalidate);
            observer.observe(host, {
                childList: true,
                subtree: !!options.deep
            });
            const disconnect = connect && connect(host, key, invalidate);
            return () => {
                observer.disconnect();
                if (disconnect) {
                    disconnect();
                }
            };
        },
    };
}

const updateReactiveChildState = (host, propName: string, multiple: boolean) => {
    let value;
    if (multiple) {
        value = host[propName].filter((el) => el.key === propName).map((el) => el.state);
    } else {
        value = host[propName].length ? host[propName].find((el) => el.key === propName)?.state : null;
    }
    // console.log('SETTING HOST %s STATE %s VALUE %s', host.id || host.category, propName, value, host[propName]);
    host.state[propName] = value;
}

export const ogodFactoryReactiveChildren = (category: string, changesCreator: ActionCreator, multiple: boolean = false, connect?) => {
    let propName;
    return {
        ...ogodFactoryChildren((o: Hybrids<any>) => o.category === category, (host, key, invalidate) => {
            const disconnect = connect && connect(host, key, invalidate);
            propName = key;
            host.initialize$.next({
                ...host.initialize$.value,
                [propName]: false
            });
            const changeListener = (e) => {
                if (e.detail.referer === category && e.detail.key === propName) {
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
                        ogodDispatchChildChanges(host, host.category, host.key);
                    }
                }
            }
            host.addEventListener(OGOD_ASYNC_CHILD_CHANGES, changeListener);
            if (host.render) {
                host.render().addEventListener(OGOD_ASYNC_CHILD_CHANGES, changeListener);
            }
            return () => disconnect && disconnect();
        }),
        observe: (host, values: Array<any>, lastValue) => {
            if (!host.initialize$.isStopped) {
                forkJoin([...values.map((v) => v.initialize$)]).subscribe({
                    complete: () => {
                        updateReactiveChildState(host, propName, multiple);
                        dispatchAsyncChildReady(host, host.category, propName);
                    }
                });
            } else {
                // updateReactiveChildState(host, propName, multiple);
            }
        }
    }
}

export const ogodFactorySceneChildren = (category: string, multiple?: boolean, connect?) => ogodFactoryReactiveChildren(category, sceneChanges, multiple, connect);
export const ogodFactoryInstanceChildren = (category: string, multiple?: boolean, connect?) => ogodFactoryReactiveChildren(category, instanceChanges, multiple, connect);
export const ogodFactorySystemChildren = (category: string, multiple?: boolean, connect?) => ogodFactoryReactiveChildren(category, systemChanges, multiple, connect);
