import { gameRun } from '@ogod/game-run';
import { makeDriverGameWorker } from '@ogod/game-worker-driver';
import { from, fromEvent, map, merge, mergeMap } from 'rxjs';
import { AppSources } from './state';
import { makeGameElementDriver } from './util';

function main(sources: AppSources) {
    const objects$ = merge(
        fromEvent(document, 'pointermove').pipe(
            mergeMap((event: PointerEvent) => from(event.getCoalescedEvents()))
        ),
        fromEvent(document, 'touchmove').pipe(mergeMap((e: TouchEvent) => e.touches))
    ).pipe(
        map(({ clientX, clientY }) => [{ key: 'objects', value: { x: clientX, y: clientY } }])
    );
    return {
        GameWorker: merge(objects$, sources.ElementHost),
        ElementHost: sources.GameWorker.input$
    };
}

export const runApp = (host) => {
    console.log('START app');
    const worker = new Worker(new URL('../worker.ts', import.meta.url));
    const disposeApp = gameRun(main, {
        GameWorker: makeDriverGameWorker(worker),
        ElementHost: makeGameElementDriver(host)
    });
    return () => {
        console.log('STOP app');
        disposeApp();
    };
};