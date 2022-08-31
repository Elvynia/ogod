import { WorkerMessage } from '@ogod/game-core';
import { makeEngineAction, makeWorkerMessage } from '@ogod/game-worker-driver';
import { define, html } from 'hybrids';
import { debounceTime, distinctUntilChanged, fromEvent, map, merge, Observable, of, startWith, Subject } from 'rxjs';
import { runApp } from './app';

interface AppElement extends HTMLElement {
    app: {
        input$: Subject<{ objects: number }>;
        output$: Observable<WorkerMessage>;
    };
    count: number;
    render: Function;
}

export function increaseCount(host: AppElement) {
    host.count += 1;
}

export default define<AppElement>({
    tag: 'app-root',
    app: {
        get: (host) => {
            host.render();
            const canvas = host.shadowRoot.querySelector('#target') as any;
            const offscreen = canvas.transferControlToOffscreen();
            return {
                input$: undefined,
                output$: merge(
                    of(makeEngineAction('OGOD_ENGINE_CANVAS', offscreen, [offscreen])),
                    fromEvent(window, 'resize').pipe(
                        debounceTime(16),
                        startWith(null),
                        map(() => makeWorkerMessage({
                            key: 'screen',
                            value: {
                                width: canvas.clientWidth,
                                height: canvas.clientHeight
                            }
                        }))
                    ),
                    fromEvent(canvas, 'click').pipe(
                        map(() => makeWorkerMessage({ key: 'reset' }))
                    )
                )
            }
        },
        connect(host) {
            console.log('[ROOT] Connect');
            const dispose = runApp(new Worker(new URL('../worker.ts', import.meta.url)), host);
            return () => {
                console.log('[ROOT] Disconnect');
                dispose();
            };
        }
    },
    count: {
        value: 0,
        connect(host, key, invalidate) {
            const { unsubscribe } = host.app.input$.pipe(
                map((state) => state.objects),
                distinctUntilChanged()
            ).subscribe((count) => {
                host[key] = count;
                invalidate();
            });
            return unsubscribe;
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
        height: 100vh;
    }
    .ui {
        position: absolute;
        left: 0;
        top: 0;
    }
  `,
});
