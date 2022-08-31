import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker } from '@ogod/game-worker-driver';
import { from, fromEvent, map, merge, mergeMap, Observable, switchMap } from 'rxjs';
import { AppReflectState, AppSources } from './state';

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
    return (sink$: Promise<Observable<AppReflectState>>) => {
        host.app.input$ = from(sink$).pipe(
            switchMap((input$) => input$)
        );
        // TODO: dispose ?
        return host.app.output$;
    }
}

export const runApp = (worker, host) => {
    console.log('START app');
    const disposeApp = gameRun(main, {
        GameWorker: makeGameEngineWorker(worker),
        ElementHost: makeGameElementDriver(host)
    });
    return () => {
        console.log('STOP app');
        worker.postMessage(makeEngineAction('OGOD_ENGINE_CLOSE'));
        disposeApp();
    }
};
