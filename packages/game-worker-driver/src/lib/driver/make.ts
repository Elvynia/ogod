import { Driver, WorkerMessage } from '@ogod/game-core';
import { AsyncSubject, from, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { GameWorkerSink, GameWorkerSource } from './state';

export function makeDriverGameWorker<R = any>(worker: Worker): Driver<GameWorkerSink, GameWorkerSource<R>> {
    return (sink$: Promise<Observable<WorkerMessage>>) => {
        console.debug('[GameWorker] Created');
        const initialized$ = new AsyncSubject<void>();
        const input$ = new ReplaySubject<R>(1);
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
