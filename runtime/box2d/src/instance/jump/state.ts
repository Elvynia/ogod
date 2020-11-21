import { Box2dStateInstanceBody } from "../body/state";

export interface Box2dStateInstanceJump extends Box2dStateInstanceBody {
    sensorY: number;
    footContacts: number;
    jumping: boolean;
    grounded: boolean;
}
