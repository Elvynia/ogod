import { Box2dStateSensor } from './../sensor/state';
import { Box2dStateInstanceBody } from "../body/state";

export interface Box2dStateInstanceJump extends Box2dStateInstanceBody {
    jumpSensor: Box2dStateSensor;
    footContacts: number;
    jumping: boolean;
    grounded: boolean;
}
