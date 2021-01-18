import { dispatch, Hybrids } from 'hybrids';

export const OGOD_ASYNC_CHILD_READY = 'OGOD_ASYNC_CHILD_READY';
export const OGOD_ASYNC_CHILD_CHANGES = 'OGOD_ASYNC_CHILD_CHANGES';

export interface AsyncState {
    [name: string]: boolean;
}

export function dispatchAsyncChildReady(host: any, referer: string, key: string) {
    console.log('CHILD READY:', host.id, host.category, referer, key);
    return dispatch(host, OGOD_ASYNC_CHILD_READY, {
        detail: {
            referer,
            key
        }
    });
}

export function ogodDispatchChildChanges(host: any, referer: string, key: string) {
    console.log('CHILD CHANGES:', host.id, host.category, referer, key);
    return dispatch(host, OGOD_ASYNC_CHILD_CHANGES, {
        detail: {
            referer,
            key
        }
    });
}
