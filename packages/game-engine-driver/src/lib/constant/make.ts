import { first, map } from 'rxjs';
import { GameEngineSource } from '../engine/state';


export function makeFeatureConstant(engine: GameEngineSource<any>, key: string) {
    return engine.state$.pipe(
        first(),
        map((state) => key.includes('.') ? key.split('.').reduce((prev, cur) => prev[cur], state) : state[key])
    );
}
