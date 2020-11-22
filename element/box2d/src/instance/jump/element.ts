import { Box2dElementInstanceBody } from './../body/element';
import { Box2dElementSensor } from './../sensor/element';

export interface Box2dElementInstanceJump extends Box2dElementInstanceBody {
    jumpSensor: Box2dElementSensor;
    footContacts: number;
    jumping: boolean;
    grounded: boolean;
}
