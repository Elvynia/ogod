import { MainDOMSource } from '@cycle/dom';
import { GameBox2DSource } from '@ogod/game-box2d-driver';
import { GameEngineSource, GameEngineWorker } from '@ogod/game-core';
import { ObjectState } from './object/state';
import { Rect } from './rect';
import { ReflectState } from './reflect/state';
import { Screen } from './screen/state';

export interface AppSources {
    GameWorker: GameEngineWorker<ReflectState>;
    DOM: MainDOMSource;
}

export interface AppState {
    screen: Screen;
    fps: number;
    objects: ObjectState;
    paused: boolean;
    grounds: Rect[];
    player: Rect;
}

export type AppAction = 'screen' | 'objects' | 'paused' | 'playerColor';

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
    World: GameBox2DSource;
}
