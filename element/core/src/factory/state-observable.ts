import { Subject, merge } from "rxjs";
import { filter, pluck } from "rxjs/operators";

export function ogodFactoryState$() {
    return {
        get: () => new Subject(),
        connect: (host) => {
            const engine = host.engine;
            const state$ = merge(engine.state$, engine.update$).pipe(
                filter((action: any) => action.id === host.id),
                pluck('state'),
                // tap((state) => console.log('update for %s : ', host.id, state))
            );
            state$.subscribe(host.state$);
        }
    };
}
