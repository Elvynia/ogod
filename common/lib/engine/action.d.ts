export declare const engineInit: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const engineStart: import("../util/action").ActionCreator<string, object>;
export declare const engineStop: import("../util/action").ActionCreator<string, object>;
export declare const engineCanvas: import("../util/action").ActionCreator<string, object>;
export declare const engineReflectChanges: import("../util/action").ActionCreator<string, {
    states: {
        id: string;
        state: any;
    }[];
}>;
export declare const engineReflectUpdates: import("../util/action").ActionCreator<string, {
    updates: {
        id: string;
        state: any;
    }[];
}>;
export declare const engineDestroy: import("../util/action").ActionCreator<string, object>;
