export interface ReflectState {
    fps: number;
    objectCount: number;
    objects: Array<{
        id: string;
        x: number;
        y: number;
        angle: number;
        width: number;
        height: number;
        health: number;
    }>
}
