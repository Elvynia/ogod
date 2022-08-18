import { GameEngineWorker, WorkerMessage } from '@ogod/game-engine-worker';
import { define, html } from 'hybrids';
import { AsyncSubject, debounceTime, distinctUntilChanged, fromEvent, map, switchMap } from 'rxjs';
import { runApp } from './app';

interface SimpleCounter extends HTMLElement {
    count: number;
    app: AsyncSubject<GameEngineWorker<any>>;
    render: Function;
}

export function increaseCount(host: SimpleCounter) {
    host.count += 1;
}

export default define<SimpleCounter>({
    tag: 'ogod-root',
    count: {
        value: 0,
        connect(host, key, invalidate) {
            const { unsubscribe } = host.app.pipe(
                switchMap((app) => app.input$.pipe(
                    map((state) => Object.keys(state.objects).length),
                    distinctUntilChanged()
                ))
            ).subscribe((count) => {
                host[key] = count;
                invalidate();
            });
            return unsubscribe;
        }
    },
    app: {
        get: () => new AsyncSubject(),
        connect(host) {
            console.log('[ROOT] Connect');
            const dispose = runApp(new Worker(new URL('../worker.ts', import.meta.url)));
            host.app.subscribe((app) => {
                host.render();
                const canvas = host.shadowRoot.querySelector('#target') as any;
                const offscreen = canvas.transferControlToOffscreen();
                offscreen.width = canvas.clientWidth;
                offscreen.height = canvas.clientHeight;
                app.output$.next([{
                    key: 'canvas',
                    complete: true,
                    value: offscreen
                } as any, [offscreen]]);
                fromEvent(window, 'resize').pipe(
                    debounceTime(16)
                ).subscribe(() => app.output$.next([{
                    key: 'app',
                    value: {
                        width: canvas.clientWidth,
                        height: canvas.clientHeight
                    }
                }]));
                fromEvent(canvas, 'click').pipe(
                    map(() => ([{ key: 'reset' }] as WorkerMessage))
                ).subscribe(app.output$);
            });
            return () => {
                console.log('[ROOT] Disconnect');
                dispose();
            };
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
