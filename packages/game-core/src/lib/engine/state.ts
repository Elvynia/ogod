import { ActionState } from '../action/state';
import { Driver } from '../driver/state';
import { GameEngineSink } from './sink/state';
import { GameEngineSource } from './source/state';

export type GameEngineDriver<S = any, A extends string = any, AS extends ActionState<A> = ActionState<A>>
    = Driver<GameEngineSink<S>, GameEngineSource<S, A, AS>>;
