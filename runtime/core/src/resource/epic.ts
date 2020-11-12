import { OGOD_CATEGORY } from "@ogod/common";
import { ogodEpicActorInit, ogodEpicActorDestroy } from '../actor/epic';

export const epicResourceInit = ogodEpicActorInit(OGOD_CATEGORY.RESOURCE);
export const epicResourceDestroy = ogodEpicActorDestroy(OGOD_CATEGORY.RESOURCE);
