import { Driver, WorkerMessage, isEngineActionInit } from '@ogod/game-core';
import { AsyncSubject, Observable, ReplaySubject, forkJoin, from, switchMap, tap } from 'rxjs';
import { makeEngineAction } from '../message/make';
import { GameWorkerSink, GameWorkerSource } from './state';

export function makeDriverGameWorker<R = any>(worker: Worker): Driver<GameWorkerSink, GameWorkerSource<R>> {
    return (sink$: Promise<Observable<WorkerMessage>>) => {
        console.debug('[GameWorker] Created');
        const initialized$ = new AsyncSubject<void>();
        const initWorker$ = new AsyncSubject<void>();
        const initEngine$ = new AsyncSubject<void>();
        forkJoin([initWorker$, initEngine$]).subscribe(() => {
            initialized$.next();
            initialized$.complete();
        })
        const sub = from(sink$).pipe(
            tap(() => console.debug('[GameWorker] Initialized')),
            switchMap((input$) => {
                initWorker$.next();
                initWorker$.complete();
                return input$;
            })
        ).subscribe((args: WorkerMessage) => worker.postMessage(...args));
        const input$ = new ReplaySubject<R>(1);
        const inputListener = (event: MessageEvent) => input$.next(event.data);
        worker.onmessage = (event) => {
            if (isEngineActionInit(event)) {
                console.debug('[GameWorker] Connected to engine');
                worker.onmessage = inputListener;
                initEngine$.next();
                initEngine$.complete();
            }
        };
        return {
            initialized$,
            input$,
            worker,
            dispose: () => {
                input$.complete();
                sub.unsubscribe();
                worker.postMessage(...makeEngineAction('OGOD_ENGINE_CLOSE'));
                console.debug('[GameWorker] Disposed');
            }
        };
    };
}
