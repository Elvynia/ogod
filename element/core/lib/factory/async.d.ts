export declare const OGOD_ASYNC_CHILD_READY = "OGOD_ASYNC_CHILD_READY";
export declare const OGOD_ASYNC_CHILD_CHANGES = "OGOD_ASYNC_CHILD_CHANGES";
export interface AsyncState {
    [name: string]: boolean;
}
export declare function dispatchAsyncChildReady(host: any, propName: any): boolean;
export declare function ogodDispatchChildChanges(host: any, referer: any): boolean;
