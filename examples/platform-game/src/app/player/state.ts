import { Shape } from "../shape/state";

export const PlayerFeet = 'feet';
export const PlayerId = 'player';

export interface Player extends Shape {
    id: typeof PlayerId;
    type: 'rect';
    grounded: number;
    jumping: boolean;
}
