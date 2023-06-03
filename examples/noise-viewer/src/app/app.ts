import { run } from '@ogod/run';
import { makeDriverGameWorker } from '@ogod/driver-worker';
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
    const disposeApp = run(main, {
        GameWorker: makeDriverGameWorker(worker),
        ElementHost: makeDriverGameElement(host)
    });
    return () => {
        console.log('STOP app');
        disposeApp();
    };
};
