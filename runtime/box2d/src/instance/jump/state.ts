import { Box2dStateBody } from "../body/state";

export interface Box2dStateBodyJump extends Box2dStateBody {
    sensorY: number;
    footContacts: number;
    jumping: boolean;
    grounded: boolean;
}
