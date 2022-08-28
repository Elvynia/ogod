import { Driver, FeatureState, GameEngineWorker, WorkerMessage } from '@ogod/game-core';
import { AsyncSubject, from, Observable, ReplaySubject, switchMap, tap } from 'rxjs';

export function makeGameEngineWorker<S extends FeatureState>(worker: Worker): Driver<Observable<WorkerMessage>, GameEngineWorker<S>> {
    return (sink$: Promise<Observable<WorkerMessage>>) => {
        console.debug('[GameWorker] Created');
        const initialized$ = new AsyncSubject<void>();
        const input$ = new ReplaySubject<S>(1);
        const sub = from(sink$).pipe(
            tap(() => console.debug('[GameWorker] Initialized')),
            switchMap((input$) => {
                initialized$.next();
                initialized$.complete();
                return input$;
            })
        ).subscribe((args: WorkerMessage) => worker.postMessage(args[0], args[1] as any));
        worker.onmessage = (event) => input$.next(event.data);
        return {
            initialized$,
            input$,
            worker,
            dispose: () => {
                input$.complete();
                sub.unsubscribe();
                console.debug('[GameWorker] Disposed');
            }
        };
    };
}