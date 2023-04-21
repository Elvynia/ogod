import { gameRun } from '@ogod/game-run';
import { makeDriverGameWorker, makeEngineAction } from '@ogod/game-worker-driver';
import { Observable, from, switchMap } from "rxjs";
import { AppReflectState, AppSources } from "./state";

function main(sources: AppSources) {
    return {
        GameWorker: sources.ElementHost,
        ElementHost: sources.GameWorker.input$
    };
}

function makeDriverGameElement(host: any) {
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
        GameWorker: makeDriverGameWorker(worker),
        ElementHost: makeDriverGameElement(host)
    });
    const stopApp = () => {
        console.log('STOP app');
        worker.postMessage(...makeEngineAction('OGOD_ENGINE_CLOSE'));
        disposeApp();
    };
    (window as any).stopApp = stopApp;
    return stopApp;
};