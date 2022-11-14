import { gameRun } from '@ogod/game-run';
import { makeEngineAction, makeGameEngineWorker, makeWorkerMessage } from '@ogod/game-worker-driver';
import { concat, debounceTime, from, fromEvent, map, merge, Observable, of, startWith, switchMap } from "rxjs";
import { AppReflectState, AppSources } from "./app/state";

function main(sources: AppSources) {
    const canvas = document.getElementById('app') as any;
    const offscreen = canvas.transferControlToOffscreen();
    return {
        GameWorker: merge(
            of(makeEngineAction('OGOD_ENGINE_CANVAS', offscreen, [offscreen])),
            fromEvent(window, 'resize').pipe(
                debounceTime(16),
                startWith(null),
                map(() => makeWorkerMessage({
                    key: 'camera',
                    value: {
                        width: canvas.clientWidth,
                        height: canvas.clientHeight
                    }
                }))
            )
        ),
        // ElementHost: sources.GameWorker.input$
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
gameRun(main, {
    GameWorker: makeGameEngineWorker(new Worker(new URL('worker.ts', import.meta.url))),
});

// export const runApp = (worker, host) => {
// console.log('START app');
// const disposeApp = gameRun(main, {
    // GameWorker: makeGameEngineWorker(new Worker('./worker.ts')),
    // ElementHost: makeGameElementDriver(host)
// });
//     return () => {
//         console.log('STOP app');
//         worker.postMessage(makeEngineAction('OGOD_ENGINE_CLOSE'));
//         disposeApp();
//     }
// };
