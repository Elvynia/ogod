import { engineCanvas, engineDestroy, engineInit, engineReflectChanges, engineReflectUpdates, engineStart, engineStop, OGOD_CATEGORY } from '@ogod/common';
import { html, Hybrids, property } from 'hybrids';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OgodElementEngine } from './element';

const nextCanvas = ({ worker }, target) => worker.postMessage(engineCanvas({ canvas: target }), [target]);
const startEngine = (worker) => worker.postMessage(engineStart());
const stopEngine = (worker) => worker.postMessage(engineStop());

export function ogodHybridEngine(categories: string[]): Hybrids<OgodElementEngine> {
    return {
        category: 'engine',
        workerPath: './worker.js',
        id: 'ogod-engine-default',
        worker: {
            connect: (host) => {
                host.worker = new Worker(host.workerPath, { type: 'module' });
                host.worker.postMessage(engineInit({ id: host.id, categories }));
                return () => host.worker.postMessage(engineDestroy());
            }
        },
        canvas: {
            ...property(false, (host) => {
                const root: ShadowRoot = host.render();
                const slot: HTMLSlotElement = root.querySelector('slot[name="canvas"]');
                const slotListener = (e) => {
                    const canvas = (e.target as HTMLSlotElement).assignedNodes().find((el) => el instanceof HTMLCanvasElement) as HTMLCanvasElement;
                    host.target = canvas;
                    nextCanvas(host, canvas.transferControlToOffscreen());
                };
                slot.addEventListener('slotchange', slotListener);
                return () => {
                    slot.removeEventListener('slotchange', slotListener);
                };
            }),
            observe: (host, value: boolean, lastValue: boolean) => {
                if (value && !lastValue) {
                    const canvas: HTMLCanvasElement = host.shadowRoot.querySelector('#ogod-canvas-default');
                    const bounds = canvas.getBoundingClientRect();
                    canvas.width = bounds.width;
                    canvas.height = bounds.height;
                    host.target = canvas;
                    nextCanvas(host, canvas.transferControlToOffscreen());
                }
            }
        },
        target: undefined,
        running: {
            ...property(false),
            observe: ({ worker }, value: boolean, lastValue: boolean) => {
                if (lastValue) {
                    stopEngine(worker);
                }
                if (value) {
                    startEngine(worker);
                }
            }
        },
        state$: {
            get: () => new BehaviorSubject({}),
            connect: ({ worker, state$ }) => {
                const messageStream = new Observable((observer) => {
                    const messageListener = (evt) => {
                        if (evt.data.type === engineReflectChanges.type) {
                            evt.data.states.forEach(({ id, state }) => observer.next({ ...state$.value, [id]: { ...state$.value[id], ...state } }));
                        }
                    };
                    worker.addEventListener('message', messageListener);
                    return () => worker.removeEventListener('message', messageListener);
                });
                messageStream.subscribe(state$);
            }
        },
        update$: {
            get: () => new Subject(),
            connect: ({ worker, update$ }) => {
                const messageStream = new Observable((observer) => {
                    const messageListener = (evt) => {
                        if (evt.data.type === engineReflectUpdates.type) {
                            evt.data.updates.forEach((action) => observer.next(action));
                        }
                    };
                    worker.addEventListener('message', messageListener);
                    return () => worker.removeEventListener('message', messageListener);
                });
                messageStream.subscribe(update$);
            }
        },
        render: () => {
            return html`
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
                        right: 0;
                        bottom: 0;
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
    }
}
