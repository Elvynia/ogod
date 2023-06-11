import { Observable, from, switchMap } from "rxjs";
import { AppReflectState } from "./state";

export function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

export function makeDriverElement(host: any) {
    return (sink$: Promise<Observable<AppReflectState>>) => {
        host.app.input$ = from(sink$).pipe(
            switchMap((input$) => input$)
        );
        // TODO: dispose ?
        return host.app.output$;
    }
}
