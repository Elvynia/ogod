import { OgodStatePositionable } from './../positionable/state';
import { OgodStateSizeable } from './../sizeable/state';
import { OgodStateInstance } from '@ogod/common';

export interface OgodStateInWorld extends OgodStateInstance, OgodStatePositionable, OgodStateSizeable {
    worldX: number;
    worldY: number;
}
