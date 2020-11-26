import { OgodCategoryState } from '@ogod/common';
import { Hybrids, property } from 'hybrids';
import { ogodFactoryParent } from '../factory/parent';
import { ogodFactoryId } from './../factory/id';
import { OgodElementActor } from './element';

export function ogodHybridActor<C extends string>(category: C): Hybrids<OgodElementActor<C>> {
    return {
        category,
        runtime: property('default'),
        id: ogodFactoryId(),
        engine: ogodFactoryParent('engine')
    };
}
