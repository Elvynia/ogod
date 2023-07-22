import { el } from '@modern-helpers/el';
import { makeMessage, makeTargetActions } from '@ogod/core';
import { makeDriverWorker } from "@ogod/driver-worker";
import { run } from "@ogod/run";
import { filter, fromEvent, map, merge } from 'rxjs';
import { AppSources } from "./app/state";

function main(sources: AppSources) {
    const canvas = el('canvas', {
        attributes: [
            ['width', '800'],
            ['height', '600'],
            ['tabindex', '0']
        ]
    }) as HTMLCanvasElement;
    const tooltip = el('div', { className: 'tooltip on' });
    const wrapper = el('div', { className: 'wrapper' }, [canvas, tooltip]);
    document.body.appendChild(wrapper);
    let selected = undefined;
    sources.Worker.input$.subscribe((state) => {
        if (state.name) {
            if (selected !== state.name) {
                selected = state.name;
                tooltip.textContent = 'Selected: ' + state.name;
                tooltip.classList.add('on');
            }
            tooltip.style.transform = `translate(
                min(calc(${canvas.width}px - 100%), max(0px, calc(${state.position.x}px - 50%))),
                max(0px, calc(${state.position.y}px - 100% - 1rem)))`;
        } else {
            selected = undefined;
            tooltip.style.transform = '';
            tooltip.classList.remove('on');
        }
    })
    return {
        Worker: merge(
            makeTargetActions({
                canvas,
                resizeDebounceTime: 16
            }),
            fromEvent(document.body, 'pointermove').pipe(
                map((e: MouseEvent) => makeMessage({
                    key: 'pointer',
                    value: {
                        x: (e.clientX / canvas.width) * 2 - 1,
                        y: -(e.clientY / canvas.height) * 2 + 1
                    }
                }))
            ),
            fromEvent(document.body, 'keydown').pipe(
                filter((e: KeyboardEvent) => e.code === 'Space'),
                map(() => makeMessage({ key: 'paused' }))
            )
        )
    }
}

(window as any).stopApp = run(main, {
    Worker: makeDriverWorker(new Worker(new URL('worker.ts', import.meta.url)))
});
