import { el } from '@modern-helpers/el';
import { makeTargetActions } from '@ogod/core';
import { makeDriverWorker } from "@ogod/driver-worker";
import { run } from "@ogod/run";
import { merge } from 'rxjs';
import { AppSources } from './app/state';

function main(sources: AppSources) {
    const canvas = el('canvas', {
        attributes: [
            ['width', '800'],
            ['height', '600'],
            ['tabindex', '0']
        ]
    }) as HTMLCanvasElement;
    const wrapper = el('div', { className: 'wrapper' }, [canvas]);
    document.body.appendChild(wrapper);
    return {
        Worker: merge(
            makeTargetActions({
                canvas,
                resizeDebounceTime: 16
            })
        )
    }
}

(window as any).stopApp = run(main, {
    Worker: makeDriverWorker(new Worker(new URL('worker.ts', import.meta.url)))
});
