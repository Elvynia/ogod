import { MainDOMSource } from '@cycle/dom';
import { GameEngineWorker } from '@ogod/game-engine-worker';
import { baseObjectVelocity } from './movement';

export interface AppSources {
    GameWorker: GameEngineWorker<AppState>;
    DOM: MainDOMSource;
}

export interface AppState {
    app: { width: number, height: number };
    fps: number;
    objects: any[];
    paused: boolean;
    ground: any;
    player: any;
}

export const initState: AppState = {
    app: {
        width: 800,
        height: 600
    },
    fps: 0,
    objects: [{
        x: 10,
        y: 10,
        width: 20,
        height: 30,
        toggleColor: '#FF0000',
        color: '#000000',
        velocity: { ...baseObjectVelocity },
    }, {
        x: 200,
        y: 249,
        width: 50,
        height: 20,
        toggleColor: '#00FF00',
        color: '#0000FF',
        velocity: { x: -baseObjectVelocity.x, y: 2 * baseObjectVelocity.y },
    }],
    paused: false,
    ground: {
        color: '#00A500',
        position: { x: 100, y: 575 },
        width: 600,
        height: 25
    },
    player: {
        color: '#ff33ff',
        position: { x: 700, y: 400 },
        width: 15,
        height: 25
    }
};
