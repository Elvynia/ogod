import { makeMessage, makeTargetActions } from '@ogod/core';
import { makeDriverWorker } from '@ogod/driver-worker';
import { run } from '@ogod/run';
import { EMPTY, filter, first, fromEvent, interval, map, merge, startWith, switchMap, takeUntil, takeWhile, timer } from 'rxjs';
import { AppReflectState, AppSources } from './app/state';

function main(sources: AppSources) {
    let paused = false;
    const playerColor = '#ff33ff';
    const app = document.querySelector('#app');
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    // Canvas focusable only if tabindex.
    canvas.setAttribute('tabindex', '0');
    const paused$ = fromEvent(canvas, 'focus').pipe(
        switchMap(() => fromEvent(canvas, 'keydown').pipe(
            takeUntil(fromEvent(canvas, 'blur')),
            filter((e: KeyboardEvent) => e.code === 'Space'),
            map(() => paused = !paused)
        )),
        startWith(paused),
        map((value) => makeMessage({ key: 'paused', value }))
    );
    const playerColorInput = document.createElement('input');
    playerColorInput.id = 'playerColor';
    playerColorInput.value = playerColor;
    playerColorInput.setAttribute('length', '7');
    const playerColor$ = fromEvent(playerColorInput, 'input').pipe(
        map((e: Event) => (e.target as any).value),
        filter((value) => value && value.length === 7),
        map((value) => makeMessage({ key: 'playerColor', value }))
    );
    const ui = document.createElement('div');
    ui.className = 'ui';
    const field = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = 'Player color';
    label.setAttribute('for', 'playerColor');
    field.appendChild(label)
    field.appendChild(playerColorInput);
    ui.appendChild(field);
    const fps = document.createElement('div');
    const fpsLabel = document.createElement('span');
    fpsLabel.textContent = 'FPS: ';
    const fpsValue = document.createElement('span');
    fpsValue.textContent = 'N/A';
    fps.appendChild(fpsLabel);
    fps.appendChild(fpsValue);
    ui.appendChild(fps);
    wrapper.appendChild(canvas);
    app.appendChild(wrapper);
    app.appendChild(ui);
    const rects: Array<HTMLElement> = [];
    sources.Worker.input$.subscribe((state) => {
        fpsValue.textContent = state.fps.toString();
        for (let i = 0; i < state.objects.length; ++i) {
            const obj = state.objects[i];
            if (!rects[i]) {
                rects[i] = document.createElement('div');
                rects[i].className = 'rect';
                wrapper.appendChild(rects[i]);
            }
            rects[i].style.color = obj.colorLight ? 'black' : 'white';
            rects[i].style.width = `${obj.width}px`;
            rects[i].style.height = `${obj.height}px`;
            rects[i].textContent = obj.health.toString();
            rects[i].style.transform = `translate(calc(${obj.x}px - 50%), calc(${canvas.height - obj.y}px - 50%))rotate(${obj.angle}rad)`;
        }
        if (rects.length > state.objects.length) {
            rects.splice(state.objects.length, rects.length - state.objects.length).forEach((el) => wrapper.removeChild(el));
        }
    })
    return {
        Worker: merge(
            makeTargetActions({
                canvas,
                resizeDebounceTime: 16
            }),
            sources.Worker.initialized$.pipe(
                map(() => makeMessage({ key: 'playerColor', value: playerColor }))
            ),
            playerColor$,
            paused$,
            fromEvent(canvas, 'mousedown').pipe(
                switchMap((e) => paused ? EMPTY : timer(200).pipe(
                    switchMap(() => interval(100).pipe(
                        map(() => e as MouseEvent),
                        map(({ clientX, clientY }) => makeMessage({
                            key: 'objects',
                            value: {
                                x: clientX + Math.round(200 - Math.random() * 400),
                                y: clientY + Math.round(200 - Math.random() * 400)
                            }
                        }))
                    )),
                    takeWhile(() => !paused),
                    takeUntil(fromEvent(document, 'mouseup').pipe(
                        first()
                    ))
                ))
            )
        )
    }
}

(window as any).stopApp = run(main, {
    Worker: makeDriverWorker<AppReflectState>(new Worker(new URL('worker.ts', import.meta.url)))
});
