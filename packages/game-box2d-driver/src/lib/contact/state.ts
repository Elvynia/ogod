export interface Contact {
    idA: string;
    idB: string;
    sensorA?: string;
    sensorB?: string;
    /**
     * 1 or -1
     */
    touching: number;
}
