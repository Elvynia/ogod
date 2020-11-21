import { OgodStatePositionable } from './../positionable/state';
import { OgodStateInstance } from "@ogod/common";
import { OgodStateSizeable } from "../sizeable/state";

export interface OgodStateTranslatable extends OgodStateInstance, OgodStatePositionable, OgodStateSizeable {
    tx: number;
    ty: number;
}
