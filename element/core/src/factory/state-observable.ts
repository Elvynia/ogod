import { Subject, merge } from "rxjs";
import { filter, pluck, tap } from "rxjs/operators";

export function ogodFactoryState$() {
    return {
        get: () => new Subject(),
        connect: (host) => {
            const engine = host.engine;
            const state$ = merge(engine.state$.pipe(
                pluck(host.id),
                filter((state) => !!state)
            ), engine.update$.pipe(
                filter((state: any) => state.id === host.id),
                pluck('state')
            ));
            const sub = state$.subscribe(host.state$);
            return () => sub.unsubscribe();
        }
    };
}
