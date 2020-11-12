"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridEngine = void 0;
const common_1 = require("@ogod/common");
const hybrids_1 = require("hybrids");
const rxjs_1 = require("rxjs");
const nextCanvas = ({ worker }, target) => worker.postMessage(common_1.engineCanvas({ canvas: target }), [target]);
const startEngine = (worker) => worker.postMessage(common_1.engineStart());
const stopEngine = (worker) => worker.postMessage(common_1.engineStop());
function ogodHybridEngine() {
    return {
        category: 'engine',
        workerPath: './worker.js',
        id: 'ogod-engine-default',
        worker: {
            connect: (host) => {
                host.worker = new Worker(host.workerPath, { type: 'module' });
                host.worker.postMessage(common_1.engineInit({ id: host.id }));
                return () => host.worker.postMessage(common_1.engineDestroy());
            }
        },
        canvas: Object.assign(Object.assign({}, hybrids_1.property(false, (host) => {
            const root = host.render();
            const slot = root.querySelector('slot[name="canvas"]');
            const slotListener = (e) => {
                const canvas = e.target.assignedNodes().find((el) => el instanceof HTMLCanvasElement);
                host.target = canvas;
                nextCanvas(host, canvas.transferControlToOffscreen());
            };
            slot.addEventListener('slotchange', slotListener);
            return () => {
                slot.removeEventListener('slotchange', slotListener);
            };
        })), { observe: (host, value, lastValue) => {
                if (value && !lastValue) {
                    const canvas = host.shadowRoot.querySelector('#ogod-canvas-default');
                    const bounds = canvas.getBoundingClientRect();
                    canvas.width = bounds.width;
                    canvas.height = bounds.height;
                    host.target = canvas;
                    nextCanvas(host, canvas.transferControlToOffscreen());
                }
            } }),
        target: undefined,
        running: Object.assign(Object.assign({}, hybrids_1.property(false)), { observe: ({ worker }, value, lastValue) => {
                if (lastValue) {
                    stopEngine(worker);
                }
                if (value) {
                    startEngine(worker);
                }
            } }),
        state$: {
            get: () => new rxjs_1.BehaviorSubject({}),
            connect: ({ worker, state$ }) => {
                const messageStream = new rxjs_1.Observable((observer) => {
                    const messageListener = (evt) => {
                        if (evt.data.type === common_1.engineReflectChanges.type) {
                            evt.data.states.forEach(({ id, state }) => observer.next(Object.assign(Object.assign({}, state$.value), { [id]: Object.assign(Object.assign({}, state$.value[id]), state) })));
                        }
                    };
                    worker.addEventListener('message', messageListener);
                    return () => worker.removeEventListener('message', messageListener);
                });
                messageStream.subscribe(state$);
            }
        },
        update$: {
            get: () => new rxjs_1.Subject(),
            connect: ({ worker, update$ }) => {
                const messageStream = new rxjs_1.Observable((observer) => {
                    const messageListener = (evt) => {
                        if (evt.data.type === common_1.engineReflectUpdates.type) {
                            evt.data.updates.forEach((action) => observer.next(action));
                        }
                    };
                    worker.addEventListener('message', messageListener);
                    return () => worker.removeEventListener('message', messageListener);
                });
                messageStream.subscribe(update$);
            }
        },
        render: ({ target }) => {
            const bounds = target && target.getBoundingClientRect();
            return hybrids_1.html `
                <style>
                    :host {
                        display: block;
                        position: relative;
                        height: 100%;
                        width: 100%;
                    }
                    ::slotted(:not(canvas)) {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: ${bounds ? bounds.width + 'px' : '100%'};
                        height: ${bounds ? bounds.height + 'px' : '100%'};
                    }
                    #ogod-canvas-default {
                        width: 100%;
                        height: 100%;
                    }
                </style>
                <slot name="ui-before"></slot>
                <slot name="canvas">
                    <canvas id="ogod-canvas-default"></canvas>
                </slot>
                <slot></slot>
                <slot name="ui-after"></slot>
            `;
        },
    };
}
exports.ogodHybridEngine = ogodHybridEngine;
//# sourceMappingURL=hybrid.js.map