import { OGOD_CATEGORY } from "@ogod/common";
import { ogodEpicActorInit, ogodEpicActorChanges, ogodEpicActorDestroy } from '../actor/epic';
import { OgodRuntimeEngine } from "../engine/runtime";

declare var self: OgodRuntimeEngine;

export const epicSceneInit = ogodEpicActorInit(OGOD_CATEGORY.SCENE);
export const epicSceneChanges = ogodEpicActorChanges(OGOD_CATEGORY.SCENE);
export const epicSceneDestroy = ogodEpicActorDestroy(OGOD_CATEGORY.SCENE);
