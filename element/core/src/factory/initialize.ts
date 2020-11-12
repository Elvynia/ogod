import { AsyncState, OGOD_ASYNC_CHILD_READY } from './async';
import { BehaviorSubject } from "rxjs";

export const ogodFactoryInitialize$ = () => ({
    get: () => new BehaviorSubject<AsyncState>({}),
    connect: (host, key, invalidate) => {
        host.initialize$.subscribe((state) => {
            if (Object.keys(state).length) {
                console.log('%s has children waiting for loading:', host.id || host.category, state);
                host.initialize$.subscribe((as) => {
                    if (Object.entries(as)
                        .map(([k, v]) => v)
                        .reduce((a, b) => a && b, true)) {
                        host.initialize$.complete();
                    }
                });
                const listener = (e) => {
                    host.initialize$.next({
                        ...host.initialize$.value,
                        [e.detail.referer]: true
                    });
                };
                host.addEventListener(OGOD_ASYNC_CHILD_READY, listener);
                return () => {
                    host.removeEventListener(OGOD_ASYNC_CHILD_READY, listener);
                }
            } else {
                console.log('%s has no children', host.id || host.category);
                host.initialize$.complete();
            }
        });
    }
});
