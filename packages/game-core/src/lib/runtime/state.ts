import { Observable } from "rxjs";

export interface RuntimeState<F> {
    value: F;
    takeUntil$?: Observable<any>;
}
