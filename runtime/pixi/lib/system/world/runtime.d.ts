import { PixiStateWorld } from "./state";
import { OgodRuntimeSystemDefault } from "@ogod/runtime-core";
export declare class PixiRuntimeWorld extends OgodRuntimeSystemDefault {
    update(delta: number, state: PixiStateWorld): void;
}
