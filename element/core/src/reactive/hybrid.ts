import { ActionCreator, OgodCategoryState } from '@ogod/common';
import { Hybrids } from 'hybrids';
import { ogodFactoryReactiveProperty } from '../factory/property';
import { ogodFactoryReactiveArrayString } from '../factory/array';
import { OgodElementReactive } from './element';
import { ogodFactoryReactiveBoolean } from '../factory/boolean';

export function ogodHybridReactive<C extends keyof OgodCategoryState>(changesCreator: ActionCreator, active: boolean = true): Hybrids<OgodElementReactive<C>> {
    return {
        active: ogodFactoryReactiveBoolean(active, changesCreator),
        tick: ogodFactoryReactiveProperty(false, changesCreator),
        updates: ogodFactoryReactiveArrayString([], changesCreator),
        reflects: ogodFactoryReactiveArrayString([], changesCreator)
    };
}
