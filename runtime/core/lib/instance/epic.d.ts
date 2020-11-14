import { OgodStateEngine, OGOD_CATEGORY } from "@ogod/common";
import { Epic } from 'redux-observable';
export declare const epicInstanceInit: Epic<import("@ogod/common").OgodActionActor<import("@ogod/common").OgodStateActor<OGOD_CATEGORY.INSTANCE>, OGOD_CATEGORY.INSTANCE>, import("@ogod/common").OgodActionActor<import("@ogod/common").OgodStateActor<OGOD_CATEGORY.INSTANCE>, OGOD_CATEGORY.INSTANCE>, OgodStateEngine<import("@ogod/common").OgodCategoryState>, any>;
export declare const epicInstanceChanges: Epic<import("@ogod/common").OgodActionReactive<import("@ogod/common").OgodStateReactive<OGOD_CATEGORY.INSTANCE>, OGOD_CATEGORY.INSTANCE>, import("@ogod/common").OgodActionReactive<import("@ogod/common").OgodStateReactive<OGOD_CATEGORY.INSTANCE>, OGOD_CATEGORY.INSTANCE>, OgodStateEngine<import("@ogod/common").OgodCategoryState>, any>;
export declare const epicInstanceDestroy: Epic<any, any, OgodStateEngine>;
