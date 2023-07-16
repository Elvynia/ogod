import { WorkerMessage, makeMessage } from '@ogod/core';
import { makeRandNum } from '@ogod/examples-common';
import { makeHybridWorker } from '@ogod/integration-hybrids';
import { define, html } from 'hybrids';
import { Subject } from 'rxjs';

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
            host[key] = '_' + makeRandNum().toString()
        }
    },
    app: makeHybridWorker({
        canvasFn: (host) => {
            host.content();
            return host.querySelector<HTMLCanvasElement>('#' + host.targetId);
        },
        workerFn: (host) => new Worker(new URL('../worker.ts', import.meta.url), {
            name: host.targetId
        })
    }),
    generator: {
        value: 'random',
        observe: (host, value) => {
            host.app.output$.next(makeMessage({
                key: 'generator',
                value
            }));
        }
    },
    scale: {
        value: 1,
        observe: (host, value) => {
            host.app.output$.next(makeMessage({
                key: 'scale',
                value
            }));
        }
    },
    offset: {
        value: 0,
        observe: (host, value) => {
            host.app.output$.next(makeMessage({
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
