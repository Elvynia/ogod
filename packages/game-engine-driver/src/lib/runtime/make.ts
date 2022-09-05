import { RuntimeState } from '@ogod/game-core';
import { Observable } from 'rxjs';

export function makeRuntime<RS extends RuntimeState<unknown>>(value: RS['value'], takeUntil$?: Observable<any>): RS {
    return {
        value,
        takeUntil$
    } as RS;
}
