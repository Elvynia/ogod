export interface UpdateState {
    elapsed: number;
    delta: number;
    timestamp: number;
}

export function isUpdateState(obj: any): obj is UpdateState {
    return typeof obj === "object" && "elapsed" in obj;
}
