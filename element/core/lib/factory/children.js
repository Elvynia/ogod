"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactorySystemChildren = exports.ogodFactoryInstanceChildren = exports.ogodFactorySceneChildren = exports.ogodFactoryReactiveChildren = void 0;
const hybrids_1 = require("hybrids");
const common_1 = require("@ogod/common");
const async_1 = require("./async");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const updateReactiveChildState = (host, propName, multiple) => {
    const values = host[propName];
    if (multiple) {
        host.state[propName] = values.map((el) => el.state);
    }
    else {
        host.state[propName] = values.length ? values[0].state : null;
    }
};
exports.ogodFactoryReactiveChildren = (category, changesCreator, multiple = false, connect) => {
    let propName;
    return Object.assign(Object.assign({}, hybrids_1.children((o) => o.category === category)), { connect(host, key, invalidate) {
            propName = key;
            host.initialize$.next(Object.assign(Object.assign({}, host.initialize$.value), { [propName]: false }));
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
                    }
                    else {
                        async_1.ogodDispatchChildChanges(host, host.category);
                    }
                }
            };
            const observer = new MutationObserver((e) => {
                invalidate();
                rxjs_1.from(e).pipe(operators_1.switchMap((record) => rxjs_1.merge(rxjs_1.from(record.addedNodes).pipe(operators_1.filter((node) => node.category != null), operators_1.map((node) => ({ node, removed: false }))), rxjs_1.from(record.removedNodes).pipe(operators_1.filter((node) => node.category != null), operators_1.map((node) => ({ node, removed: true })))))).subscribe(({ node, removed }) => {
                    if (removed) {
                        node.removeEventListener(async_1.OGOD_ASYNC_CHILD_CHANGES, changeListener);
                    }
                    else {
                        node.addEventListener(async_1.OGOD_ASYNC_CHILD_CHANGES, changeListener);
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
        }, observe: (host, values, lastValue) => {
            if (!host.initialize$.isStopped) {
                rxjs_1.forkJoin(...values.map((v) => v.initialize$)).subscribe({
                    complete: () => {
                        updateReactiveChildState(host, propName, multiple);
                        async_1.dispatchAsyncChildReady(host, propName);
                    }
                });
            }
            else {
                console.warn('%s children %s changed (state changes not implemented!)', host.id || host.category, propName);
            }
        } });
};
exports.ogodFactorySceneChildren = (category, multiple, connect) => exports.ogodFactoryReactiveChildren(category, common_1.sceneChanges, multiple, connect);
exports.ogodFactoryInstanceChildren = (category, multiple, connect) => exports.ogodFactoryReactiveChildren(category, common_1.instanceChanges, multiple, connect);
exports.ogodFactorySystemChildren = (category, multiple, connect) => exports.ogodFactoryReactiveChildren(category, common_1.systemChanges, multiple, connect);
//# sourceMappingURL=children.js.map