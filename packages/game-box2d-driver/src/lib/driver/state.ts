import { Driver } from '@ogod/game-core';
import { GameBox2dSink } from '../sink/state';
import { GameBox2dSource } from '../source/state';

export type GameBox2dDriver = Driver<GameBox2dSource, GameBox2dSink>;
