import { WorkerMessage, isMessageEngineInit, makeMessageEngine, makeTargetActions } from "@ogod/core";
import { Descriptor } from "hybrids";
import { AsyncSubject, ReplaySubject, Subject, switchMap, tap } from "rxjs";
import { HybridWorker } from "./state";

export function makeHybridWorker<COMPONENT, STATE>(params: {
    canvasFn: (host: COMPONENT) => HTMLCanvasElement,
    resizeDebounceTime?: number,
    workerFn: (host: COMPONENT) => Worker
}): Descriptor<COMPONENT, HybridWorker<STATE>> {
    return {
        get: () => ({
            initialized$: new AsyncSubject(),
            input$: new ReplaySubject<STATE>(1),
            output$: new Subject<WorkerMessage>()
        }),
        connect: (host, key) => {
            let id = 'WorkerHybrid';
            if (host.id) {
                id += '#' + host.id;
            }
            const worker = params.workerFn(host);
            host[key].output$.subscribe((args: WorkerMessage) => worker.postMessage(...args));
            const inputListener = (event: MessageEvent) => host[key].input$.next(event.data);
            worker.onmessage = (event) => {
                if (isMessageEngineInit(event.data)) {
                    console.debug(`[${id}] Connected to engine`);
                    worker.onmessage = inputListener;
                    host[key].initialized$.next();
                    host[key].initialized$.complete();
                }
            }
            const canvas = params.canvasFn(host);
            const resizeDebounceTime = params.resizeDebounceTime || 16;
            host[key].initialized$.pipe(
                tap(() => console.debug(`[${id}] Initialized`)),
                switchMap(() => makeTargetActions({
                    canvas,
                    resizeDebounceTime
                }))
            ).subscribe(host[key].output$);
            console.debug(`[${id}] Created`);
            return () => {
                host[key].input$.complete();
                host[key].output$.complete();
                worker.postMessage(...makeMessageEngine('OGOD_ENGINE_CLOSE'));
                console.debug(`[${id}] Disposed`);
            };
        }
    }
}
