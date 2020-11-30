import { dispatch } from 'hybrids';

export const OGOD_ASYNC_CHILD_READY = 'OGOD_ASYNC_CHILD_READY';
export const OGOD_ASYNC_CHILD_CHANGES = 'OGOD_ASYNC_CHILD_CHANGES';

export interface AsyncState {
    [name: string]: boolean;
}

export function dispatchAsyncChildReady(host, propName) {
    return dispatch(host, OGOD_ASYNC_CHILD_READY, {
        detail: {
            referer: propName
        }
    });
}

export function ogodDispatchChildChanges(host, referer) {
    return dispatch(host, OGOD_ASYNC_CHILD_CHANGES, {
        detail: {
            referer
        }
    });
}
