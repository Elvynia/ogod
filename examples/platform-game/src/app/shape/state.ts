import { b2Body, b2BodyType } from "@box2d/core";
import { Rect } from "@ogod/examples-common";
import { Player } from "./player/state";

export interface Shape extends Rect {
    fixedRotation?: boolean;
    bodyType: b2BodyType;
    body: b2Body;
    density?: number;
    worldX: number;
    worldY: number;

}

export interface Shapes {
    player: Player;
    [key: string]: Shape;
}
