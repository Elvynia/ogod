import { el } from '@modern-helpers/el';
import { makeMessage, makeTargetActions } from '@ogod/core';
import { makeDriverWorker } from '@ogod/driver-worker';
import { run } from '@ogod/run';
import { EMPTY, filter, first, fromEvent, interval, map, merge, startWith, switchMap, takeUntil, takeWhile, timer } from 'rxjs';
import { AppReflectState, AppSources } from './app/state';

function main(sources: AppSources) {
    let paused = false;
    const playerColor = '#ff33ff';
    const playerColorId = 'playerColor';
    const canvas = el('canvas', {
        attributes: [
            ['width', '800'],
            ['height', '600'],
            ['tabindex', '0']
        ]
    }) as HTMLCanvasElement;
    const wrapper = el('div', { className: 'wrapper' }, [canvas]);
    const playerColorInput = el('input', {
        attributes: [
            ['id', playerColorId],
            ['value', playerColor],
            ['maxlength', '7']
        ]
    }) as HTMLInputElement;
    const fpsEl = el('span', undefined, ['N/A']);
    const countEl = el('span', undefined, ['N/A']);
    const boxCountEl = el('span', undefined, ['N/A']);
    const ui = el('div', { className: 'ui' }, [
        el('div', undefined, [
            el('label', { attributes: [['for', playerColorId]] }, ['Player color']),
            playerColorInput
        ]),
        el('div', undefined, [
            el('span', undefined, ['FPS: ']),
            fpsEl
        ]),
        el('div', undefined, [
            el('span', undefined, ['Object count: ']),
            countEl
        ]),
        el('div', undefined, [
            el('span', undefined, ['Box2d object count: ']),
            boxCountEl
        ])
    ]);
    const app = el('div', undefined, [wrapper, ui]);
    document.body.appendChild(app);
    const rects: Array<HTMLElement> = [];
    sources.Worker.input$.subscribe((state) => {
        fpsEl.textContent = state.fps.toString();
        countEl.textContent = state.objects.length.toString();
        boxCountEl.textContent = state.box2dCount.toString();
        for (let i = 0; i < state.objects.length; ++i) {
            const obj = state.objects[i];
            if (!rects[i]) {
                rects[i] = el('div', { className: 'rect' });
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
            fromEvent(playerColorInput, 'input').pipe(
                map(() => playerColorInput.value),
                filter((value) => value && value.length === 7),
                map((value) => makeMessage({ key: 'playerColor', value }))
            ),
            fromEvent(canvas, 'focus').pipe(
                switchMap(() => fromEvent(canvas, 'keydown').pipe(
                    takeUntil(fromEvent(canvas, 'blur')),
                    filter((e: KeyboardEvent) => e.code === 'Space'),
                    map(() => paused = !paused)
                )),
                startWith(paused),
                map((value) => makeMessage({ key: 'paused', value }))
            ),
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
