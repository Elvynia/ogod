import { Driver } from '../driver/state';
import { GameEngineSink } from './sink/state';
import { GameEngineSource } from './source/state';

export type GameEngineDriver = Driver<GameEngineSink, GameEngineSource>;
