import { PlatformState } from './platform/state';

export interface MapState {
    platforms: PlatformState;
    width: number;
    height: number;
    gravity: number;
    scale: number;
    level: number;
}
