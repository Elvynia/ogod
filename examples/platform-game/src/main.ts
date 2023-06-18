import { el } from '@modern-helpers/el';
import { makeMessage, makeTargetActions } from '@ogod/core';
import { makeDriverWorker } from '@ogod/driver-worker';
import { run } from '@ogod/run';
import { distinctUntilKeyChanged, filter, finalize, fromEvent, map, merge, switchMap, takeWhile } from 'rxjs';
import { makeControls$ } from './app/controls/make';
import { makeElementMenu } from './app/menu/make';
import { PHASE } from './app/phase/state';
import { AppReflectState, AppSources } from "./app/state";

function main(sources: AppSources) {
    const canvas = el('canvas', {
        attributes: [
            ['tabindex', '0']
        ]
    }) as HTMLCanvasElement;
    const startEl = el('div', { className: 'ui-item start' }, ['START']);
    const fpsEl = el('span', { className: 'ui-value' }, ['N/A']);
    const levelEl = el('span', { className: 'ui-value' }, ['N/A']);
    const wrapperEl = el('div', { className: 'wrapper' }, [
        canvas,
        el('div', { className: 'ui' }, [
            el('h3', { className: 'ui-item' }, ['Level:', levelEl]),
            el('h3', { className: 'ui-item' }, ['FPS:', fpsEl])
        ])
    ]);
    document.body.appendChild(wrapperEl);
    sources.Worker.input$.pipe(
        distinctUntilKeyChanged('phase'),
        filter((s) => s.phase === PHASE.START)
    ).subscribe(() => wrapperEl.appendChild(startEl));
    const loadingEls: Array<HTMLElement> = [];
    sources.Worker.input$.pipe(
        distinctUntilKeyChanged('phase'),
        filter(({ phase }) => phase === PHASE.LOAD),
        switchMap(() => sources.Worker.input$.pipe(
            takeWhile(({ phase }) => phase === PHASE.LOAD),
            map((state) => Object.values(state.loading)),
            finalize(() => loadingEls.splice(0, loadingEls.length).forEach((el) => wrapperEl.removeChild(el)))
        ))
    ).subscribe((loadings) => {
        loadings.forEach((l, i) => {
            if (!loadingEls[i]) {
                loadingEls[i] = el('div', { className: 'ui-item loading' }, [
                    l.message,
                    el('div', { className: 'progress' }, [l.progress.toString() + '%'])
                ]);
                wrapperEl.appendChild(loadingEls[i]);
            } else {
                loadingEls[i].childNodes[1].textContent = l.progress.toString() + '%';
            }
            if (loadingEls.length > loadings.length) {
                loadingEls.splice(loadings.length, loadingEls.length - loadings.length).forEach((el) => wrapperEl.removeChild(el));
            }
        });
    });
    sources.Worker.input$.pipe(
        filter(({ phase }) => phase > 0)
    ).subscribe(({ fps }) => fpsEl.textContent = fps.toString());
    sources.Worker.input$.pipe(
        filter(({ phase }) => phase > 0),
        distinctUntilKeyChanged('level')
    ).subscribe(({ level }) => levelEl.textContent = level.toString());
    return {
        Worker: merge(
            makeTargetActions({
                canvas,
                resizeDebounceTime: 16
            }),
            makeControls$({ jump: 'Space', left: 'KeyA', right: 'KeyD' }),
            fromEvent(startEl, 'click').pipe(
                map(() => {
                    wrapperEl.removeChild(startEl);
                    return makeMessage({
                        key: 'phase',
                        value: PHASE.LOAD
                    });
                })
            ),
            makeElementMenu(sources, wrapperEl)
        )
    }
}
const worker = new Worker(new URL('worker.ts', import.meta.url));
(window as any).stopApp = run(main, {
    Worker: makeDriverWorker<AppReflectState>(worker)
});
