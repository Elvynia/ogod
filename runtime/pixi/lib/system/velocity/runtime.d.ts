import { OgodRuntimeSystemDefault } from "@ogod/runtime-core";
import { PixiStateVelocity } from "./state";
export declare class PixiRuntimeVelocity extends OgodRuntimeSystemDefault {
    update(delta: number, state: PixiStateVelocity): void;
    protected getModifier(state: PixiStateVelocity): (delta: number) => (instance: any) => void;
}
