import { define, Hybrids } from 'hybrids';


export function ogodDefineElement<E extends HTMLElement>(
    tagName: string,
    base: Hybrids<any>,
    stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[]
): hybrids.HybridElement<E> {
    let element = stateHybrids ? stateHybrids.reduce((a, b) => Object.assign(a, b), {}) : {};
    element = {
        ...element,
        ...base
    };
    if (overrideHybrids) {
        overrideHybrids.forEach((overrides) => {
            element = {
                ...element,
                ...overrides
            };
        });
    }
    return define(tagName, element);
}