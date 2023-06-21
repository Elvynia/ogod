import { WorkerMessage, isMessageEngineInit, makeMessageEngine } from '@ogod/core';
import { AsyncSubject, Observable, ReplaySubject, forkJoin, from, switchMap } from 'rxjs';
import { DriverWorker } from './state';

export function makeDriverWorker<R = any>(worker: Worker, name?: string): DriverWorker<R> {
    return (sink$: Promise<Observable<WorkerMessage>>) => {
        let id = 'Worker';
        if (name) {
            id += '#' + name;
        }
        const initialized$ = new AsyncSubject<void>();
        const initWorker$ = new AsyncSubject<void>();
        const initEngine$ = new AsyncSubject<void>();
        forkJoin([initWorker$, initEngine$]).subscribe(() => {
            initialized$.next();
            initialized$.complete();
            console.debug(`[${id}] Initialized`);
        });
        const sub = from(sink$).pipe(
            switchMap((input$) => {
                initWorker$.next();
                initWorker$.complete();
                return input$;
            })
        ).subscribe((args: WorkerMessage) => worker.postMessage(...args));
        const input$ = new ReplaySubject<R>(1);
        const inputListener = (event: MessageEvent) => input$.next(event.data);
        worker.onmessage = (event) => {
            if (isMessageEngineInit(event.data)) {
                console.debug(`[${id}] Connected to engine`);
                worker.onmessage = inputListener;
                initEngine$.next();
                initEngine$.complete();
            }
        };
        console.debug(`[${id}] Created`);
        return {
            initialized$,
            input$,
            worker,
            dispose: () => {
                input$.complete();
                sub.unsubscribe();
                worker.postMessage(...makeMessageEngine('OGOD_ENGINE_CLOSE'));
                console.debug(`[${id}] Disposed`);
            }
        };
    };
}
