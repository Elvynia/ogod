import { b2Body, b2BodyType } from "@box2d/core";
import { Player } from "./player/state";

export interface Shape {
    angle?: number;
    fixedRotation?: boolean;
    bodyType: b2BodyType;
    body: b2Body;
    density?: number;
    id: string;
    color: string;
    type: 'rect' | 'circle';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Shapes {
    player: Player;
    [key: string]: Shape;
}
