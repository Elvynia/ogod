import { OGOD_CATEGORY } from "@ogod/common";
import { ogodEpicActorChanges, ogodEpicActorDestroy, ogodEpicActorInit } from '../actor/epic';

export const epicInstanceInit = ogodEpicActorInit(OGOD_CATEGORY.INSTANCE);
export const epicInstanceChanges = ogodEpicActorChanges(OGOD_CATEGORY.INSTANCE);
export const epicInstanceDestroy = ogodEpicActorDestroy(OGOD_CATEGORY.INSTANCE);
