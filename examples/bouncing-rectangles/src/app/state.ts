import { MainDOMSource } from '@cycle/dom';
import { GameEngineWorker } from '@ogod/game-engine-worker';
import { Rect } from './rectangle';

export interface AppSources {
    GameWorker: GameEngineWorker<AppState>;
    DOM: MainDOMSource;
}

export interface AppSize {
    width: number;
    height: number;
    scale: number;
}

export interface AppState {
    app: AppSize;
    fps: number;
    objects: Rect[];
    paused: boolean;
    grounds: Rect[];
    player: Rect;
}

export const makeInitState = () => ({
    app: {
        width: 800,
        height: 600,
        scale: 10
    },
    fps: 0,
    objects: [],
    paused: false
} as AppState);
