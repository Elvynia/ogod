import run from '@cycle/run';
import { makeGameEngineWorker } from '@ogod/game-worker-driver';
import { from, fromEvent, map, merge, mergeMap, Observable } from 'rxjs';
import { Stream } from 'xstream';
import { AppSources, AppState } from './state';

function main(sources: AppSources) {
    const objects$ = merge(
        fromEvent(document, 'mousemove') as Observable<MouseEvent>,
        fromEvent(document, 'touchmove').pipe(mergeMap((e: TouchEvent) => e.touches))
    ).pipe(
        map(({ clientX, clientY }) => [{ key: 'objects', value: { x: clientX, y: clientY } }])
    );
    return {
        GameWorker: merge(objects$, sources.ElementHost),
        ElementHost: sources.GameWorker.input$
    };
}

function makeGameElementDriver(host: any) {
    return (sink$: Stream<AppState>) => {
        host.app.input$ = from(sink$ as any);
        // TODO: dispose ?
        return host.app.output$;
    }
}

export const runApp = (worker, host) => {
    console.log('START app');
    const disposeApp = run(main, {
        GameWorker: makeGameEngineWorker(worker),
        ElementHost: makeGameElementDriver(host)
    });
    return () => {
        console.log('STOP app');
        worker.postMessage({ key: 'close' });
        disposeApp();
    }
};
