import { gameRun } from '@ogod/game-run';
import { makeDriverGameWorker, makeEngineAction } from '@ogod/game-worker-driver';
import { from, fromEvent, map, merge, mergeAll, mergeMap, Observable, switchMap } from 'rxjs';
import { AppReflectState, AppSources } from './state';

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

function makeGameElementDriver(host: any) {
    return (sink$: Promise<Observable<AppReflectState>>) => {
        host.app.input$ = from(sink$).pipe(
            switchMap((input$) => input$)
        );
        // TODO: dispose ?
        return host.app.output$;
    }
}

export const runApp = (host) => {
    console.log('START app');
    const worker = new Worker(new URL('../worker.ts', import.meta.url));
    const disposeApp = gameRun(main, {
        GameWorker: makeDriverGameWorker(worker),
        ElementHost: makeGameElementDriver(host)
    });
    const stopApp = () => {
        console.log('STOP app');
        worker.postMessage(...makeEngineAction('OGOD_ENGINE_CLOSE'));
        disposeApp();
    };
    (window as any).stopApp = stopApp;
    return stopApp;
};
