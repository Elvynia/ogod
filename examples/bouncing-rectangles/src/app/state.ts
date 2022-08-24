import { MainDOMSource } from '@cycle/dom';
import { GameEngineWorker } from '@ogod/game-worker-driver';
import { Subject } from 'rxjs';
import { Rect } from './rectangle';

export interface Contact {
    idA: string;
    idB: string;
    touching: boolean;
}

export interface ObjectState {
    [id: string]: Rect;
}

export interface AppReflectState {
    fps: number;
    objectCount: number;
    objects: Array<{
        id: string;
        x: number;
        y: number;
        angle: number;
        width: number;
        height: number;
        health: number;
    }>
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
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
    objects: ObjectState;
    paused: boolean;
    grounds: Rect[];
    player: Rect;
}

// FIXME: define this automatically in makeGameEngineOptions.
export interface AppActions {
    app: Subject<any>;
    objects: Subject<Event>;
    paused: Subject<boolean>;
    playerColor: Subject<string>;
    contact: Subject<Contact>;
}
