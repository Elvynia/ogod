import { WorkerMessage } from '@ogod/core';
import { makeEngineAction, makeWorkerMessage } from '@ogod/driver-worker';
import { define, html } from 'hybrids';
import { debounceTime, fromEvent, map, merge, of, startWith, Subject } from 'rxjs';
import { runApp } from './app';
import { randNum } from './util';

interface AppElement extends HTMLElement {
    app: {
        input$: Subject<{ objects: number }>;
        output$: Subject<WorkerMessage>;
    };
    content: Function;
    generator: string;
    scale: number;
    offset: number;
    targetId: string;
}

export default define<AppElement>({
    tag: 'noise-viewer',
    targetId: {
        value: '',
        connect: (host, key) => {
            host[key] = '_' + randNum(8).toString()
        }
    },
    app: {
        value: undefined,
        connect(host) {
            console.log('[ROOT] Connect');
            host.app = {
                input$: undefined,
                output$: new Subject<WorkerMessage>()
            };
            const dispose = runApp(new Worker(new URL('../worker.ts', import.meta.url)), host);
            host.content();
            const canvas = host.querySelector('#' + host.targetId) as any;
            const offscreen = canvas.transferControlToOffscreen();
            setTimeout(() => {
                merge(
                    of(makeEngineAction('OGOD_ENGINE_TARGET', offscreen, [offscreen])),
                    fromEvent(window, 'resize').pipe(
                        debounceTime(16),
                        startWith(null),
                        map(() => makeWorkerMessage({
                            key: 'camera',
                            value: {
                                width: canvas.clientWidth,
                                height: canvas.clientHeight
                            }
                        }))
                    ),
                ).subscribe(host.app.output$)
            }, 1000);
            return () => {
                console.log('[ROOT] Disconnect');
                dispose();
            };
        }
    },
    generator: {
        value: 'random',
        connect: (host, key) => {
            setTimeout(() => host.app.output$.next(makeWorkerMessage({
                key,
                value: host[key]
            })), 1000);
        },
        observe: (host, value) => {
            host.app.output$.next(makeWorkerMessage({
                key: 'generator',
                value
            }));
        }
    },
    scale: {
        value: 1,
        connect: (host, key) => {
            setTimeout(() => host.app.output$.next(makeWorkerMessage({
                key,
                value: host[key]
            })), 1000);
        },
        observe: (host, value) => {
            host.app.output$.next(makeWorkerMessage({
                key: 'scale',
                value
            }));
        }
    },
    offset: {
        value: 0,
        connect: (host, key) => {
            setTimeout(() => host.app.output$.next(makeWorkerMessage({
                key,
                value: host[key]
            })), 1000);
        },
        observe: (host, value) => {
            host.app.output$.next(makeWorkerMessage({
                key: 'offset',
                value
            }));
        }
    },
    content: (host) => html`
    <div class="d-flex flex-column m-4">
        <canvas id="${host.targetId}" tabindex="1"></canvas>
        <div class="d-flex flex-column">
            <div class="form-group">
                <label for="gen">Generator type:</label>
                <select name="gen" class="form-control" value="${host.generator}" onchange="${(h, e) => h.generator = e.target.value}">
                    <option value="random">Random</option>
                    <option value="perlin">Simplex perlin (rand)</option>
                    <option value="perlin-constant">Simplex perlin (const)</option>
                </select>
            </div>
            <div class="form-group" hidden="${host.generator === 'random'}">
                <label for="scale">Scale:</label>
                <input type="number" step="0.001" name="scale" class="form-control"
                    value="${host.scale}" onchange="${(h, e) => h.scale = e.target.value}">
            </div>
            <div class="form-group" hidden="${host.generator !== 'perlin-constant'}">
                <label for="offset">Offset:</label>
                <input type="number" step="0.0001" name="offset" class="form-control"
                    value="${host.offset}" onchange="${(h, e) => h.offset = e.target.value}">
            </div>
            <div class="d-flex justify-content-center mt-2">
                <button class="btn btn-danger" onclick="${() => host.remove()}">Delete</button>
            </div>
        </div>
    </div>
  `
});
