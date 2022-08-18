import run from '@cycle/run';
import { makeGameEngineWorker } from '@ogod/game-engine-worker';
import { fromEvent, merge, mergeMap, Observable } from 'rxjs';
import { AppSources } from './state';

function main(sources: AppSources) {
    const root = document.getElementById('app') as any;
    root.app.next(sources.GameWorker);
    root.app.complete();
    merge(
        fromEvent(document, 'mousemove') as Observable<MouseEvent>,
        fromEvent(document, 'touchmove').pipe(mergeMap((e: TouchEvent) => e.touches))
    ).subscribe(({ clientX, clientY }) => sources.GameWorker.output$.next([{ key: 'objects', value: { x: clientX, y: clientY } }]));
    return {};
}

export const runApp = (worker) => {
    console.log('START app');
    const disposeApp = run(main, {
        GameWorker: makeGameEngineWorker(worker)
    });
    return () => {
        console.log('STOP app');
        worker.postMessage({ key: 'close' });
        disposeApp();
    }
};
