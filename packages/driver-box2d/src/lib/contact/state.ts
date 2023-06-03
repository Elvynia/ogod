export interface Contact<T = any, S = any> {
    dataA: T;
    dataB: T;
    sensorA?: S;
    sensorB?: S;
    touching: number;
}
