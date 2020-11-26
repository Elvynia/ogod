import { OGOD_CATEGORY } from "@ogod/common";
import { ogodEpicActorInit, ogodEpicActorDestroy, ogodEpicActorChanges } from '../actor/epic';

export const epicResourceInit = ogodEpicActorInit(OGOD_CATEGORY.RESOURCE);
export const epicResourceChanges = ogodEpicActorChanges(OGOD_CATEGORY.RESOURCE);
export const epicResourceDestroy = ogodEpicActorDestroy(OGOD_CATEGORY.RESOURCE);
