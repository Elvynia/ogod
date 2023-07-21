import { PlatformState } from './platform/state';

export interface MapState {
    platforms: PlatformState;
    platformWidth: number;
    width: number;
    height: number;
    gravity: number;
    scale: number;
    level: number;
    size: number;
}
