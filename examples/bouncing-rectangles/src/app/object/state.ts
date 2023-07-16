import { b2Body } from "@box2d/core";
import { Rect } from "@ogod/examples-common";

export interface Box extends Rect {
    dynamic: boolean;
    body: b2Body;
    health: number;
    colorLight: boolean;
}
export interface ObjectState {
    [id: string]: Box;
}
