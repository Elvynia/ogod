import { ActionCreator, OgodCategoryState } from '@ogod/common';
import { Hybrids } from 'hybrids';
import { OgodElementReactive } from './element';
export declare function ogodHybridReactive<C extends keyof OgodCategoryState>(changesCreator: ActionCreator, active?: boolean): Hybrids<OgodElementReactive<C>>;
