import { Shape } from "../state";

export const PlayerFeet = 'feet';
export const PlayerId = 'player';

export interface Player extends Shape {
    id: typeof PlayerId;
    grounded: number;
    jumping: boolean;
}
