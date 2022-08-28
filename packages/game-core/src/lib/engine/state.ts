import { ActionHandler } from '../action/state';
import { Driver } from '../driver/state';
import { FeatureState } from '../feature/state';
import { GameEngineSink } from './sink/state';
import { GameEngineSource } from './source/state';

export type GameEngineDriver<S extends FeatureState, AS = {}, R = any,
    AH extends ActionHandler<Partial<S> & AS> = ActionHandler<Partial<S> & AS>> = Driver<GameEngineSink<S, R>, GameEngineSource<S, AS, AH>>;
