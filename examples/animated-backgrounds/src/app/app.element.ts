import { WorkerMessage, isMessageEngineInit, makeMessage, makeMessageEngine, makeTargetActions } from "@ogod/core";
import { Component, Descriptor, define, html } from "hybrids";
import { AsyncSubject, ReplaySubject, Subject, from, fromEvent, map, merge, mergeMap, switchMap, tap } from "rxjs";
import { AppReflectState } from "./state";

interface HybridWorker<R> {
    initialized$: AsyncSubject<void>;
    input$: ReplaySubject<R>;
    output$: Subject<WorkerMessage>;
}

interface AppElement extends HTMLElement {
    app: HybridWorker<AppReflectState>;
    canvas: HTMLCanvasElement;
    count: number;
    render: () => AppElement;
}

export function makeHybridWorker<E, R>(params: {
    canvasFn: (host: E) => HTMLCanvasElement,
    resizeDebounceTime?: number,
    workerFn: (host: E) => Worker
}): Descriptor<E, HybridWorker<R>> {
    return {
        get: () => ({
            initialized$: new AsyncSubject(),
            input$: new ReplaySubject<R>(1),
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

const BackgroundElement: Component<AppElement> = {
    tag: 'app-root',
    canvas: {
        get: (host) => {
            host.render();
            return host.shadowRoot.querySelector<HTMLCanvasElement>('#target');
        },
        connect: (host) => {
            const sub = merge(
                fromEvent(host.canvas, 'click').pipe(
                    map(() => makeMessage({
                        key: 'reset'
                    }))
                ),
                merge(
                    fromEvent(host.canvas, 'pointermove', {
                        passive: true
                    }).pipe(
                        mergeMap((event: PointerEvent) => from(event.getCoalescedEvents()))
                    ),
                    fromEvent(host.canvas, 'touchmove', {
                        passive: true
                    }).pipe(
                        mergeMap((e: TouchEvent) => e.touches)
                    )
                ).pipe(
                    map(({ clientX, clientY }) => makeMessage({
                        key: 'objects',
                        value: {
                            x: clientX,
                            y: clientY
                        }
                    }))
                )
            ).subscribe(host.app.output$);
            return () => sub.unsubscribe();
        }
    },
    app: makeHybridWorker({
        canvasFn: (host) => host.canvas,
        workerFn: (host) => new Worker(new URL('../worker.ts', import.meta.url), {
            name: host.id
        })
    }),
    count: {
        value: 0,
        connect(host, key, invalidate) {
            const sub = host.app.input$.pipe(
                map((state) => state.objects)
            ).subscribe((count) => {
                host[key] = count;
                invalidate();
            });
            return () => sub.unsubscribe();
        }
    },
    render: ({ count }) => html`
    <canvas id="target" tabindex="1"></canvas>
    <div class="ui">
        <h3>Object count: ${count}</h3>
    </div>
  `.css`
    canvas {
        width: 100%;
        height: 100%;
    }
    .ui {
        position: absolute;
        left: 1rem;
        top: 0;
    }
  `,
};

export default define(BackgroundElement);
