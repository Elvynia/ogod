import { ogodActionName, ogodActionCreator, ogodActionParams } from "@ogod/common";

export const contextNext = ogodActionCreator(ogodActionName('context', 'Next'), ogodActionParams<{ context: OffscreenCanvasRenderingContext2D }>());