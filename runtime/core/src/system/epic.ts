import { OGOD_CATEGORY } from "@ogod/common";
import { ogodEpicActorInit, ogodEpicActorChanges, ogodEpicActorDestroy } from '../actor/epic';

export const epicSystemInit = ogodEpicActorInit(OGOD_CATEGORY.SYSTEM);
export const epicSystemChanges = ogodEpicActorChanges(OGOD_CATEGORY.SYSTEM);
export const epicSystemDestroy = ogodEpicActorDestroy(OGOD_CATEGORY.SYSTEM);
