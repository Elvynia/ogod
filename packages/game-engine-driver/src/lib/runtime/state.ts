import { Observable } from 'rxjs';
import { GameState } from '../game/state';

export type RuntimeState<S extends GameState> = {
    [K in keyof S]: Observable<S[K]>;
}
