import { WorkerMessage } from '@ogod/game-engine-worker';
import { define, html } from 'hybrids';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subject } from 'rxjs';
import { runApp } from './app';
import { AppState } from './state';

interface SimpleCounter extends HTMLElement {
    app: {
        input$: Subject<AppState>;
        output$: Subject<WorkerMessage>;
    };
    count: number;
    render: Function;
}

export function increaseCount(host: SimpleCounter) {
    host.count += 1;
}

export default define<SimpleCounter>({
    tag: 'ogod-root',
    app: {
        get: () => ({
            input$: undefined,
            output$: new Subject()
        }),
        connect(host) {
            console.log('[ROOT] Connect');
            const dispose = runApp(new Worker(new URL('../worker.ts', import.meta.url)), host);
            host.render();
            const canvas = host.shadowRoot.querySelector('#target') as any;
            const offscreen = canvas.transferControlToOffscreen();
            offscreen.width = canvas.clientWidth;
            offscreen.height = canvas.clientHeight;
            host.app.output$.next([{
                key: 'canvas',
                complete: true,
                value: offscreen
            } as any, [offscreen]] as WorkerMessage);
            fromEvent(window, 'resize').pipe(
                debounceTime(16)
            ).subscribe(() => host.app.output$.next([{
                key: 'app',
                value: {
                    width: canvas.clientWidth,
                    height: canvas.clientHeight
                }
            }]));
            fromEvent(canvas, 'click').pipe(
                map(() => ([{ key: 'reset' }] as WorkerMessage))
            ).subscribe(host.app.output$);
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
                map((state) => Object.keys(state.objects).length),
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
