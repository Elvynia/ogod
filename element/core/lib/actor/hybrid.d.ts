import { OgodCategoryState } from '@ogod/common';
import { Hybrids } from 'hybrids';
import { OgodElementActor } from './element';
export declare function ogodHybridActor<C extends keyof OgodCategoryState>(category: C): Hybrids<OgodElementActor<C>>;
