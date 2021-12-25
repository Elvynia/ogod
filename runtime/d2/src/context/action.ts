import { ogodActionName, ogodActionCreator } from "@ogod/common";

export const contextNext = ogodActionCreator<{ context: OffscreenCanvasRenderingContext2D }>(ogodActionName('context', 'Next'));
