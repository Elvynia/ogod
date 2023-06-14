import { makeMessage } from "@ogod/core";
import { HybridWorker, makeHybridWorker } from '@ogod/integration-hybrids';
import { Component, define, html } from "hybrids";
import { from, fromEvent, map, merge, mergeMap } from "rxjs";
import { AppReflectState } from "./state";

interface AppElement extends HTMLElement {
    app: HybridWorker<AppReflectState>;
    canvas: HTMLCanvasElement;
    count: number;
    render: () => AppElement;
}

const BackgroundElement: Component<AppElement> = {
    tag: 'animated-background',
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
