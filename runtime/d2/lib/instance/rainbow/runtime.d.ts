import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { D2StateRainbow } from './state';
export declare class D2RuntimeRainbow extends OgodRuntimeInstanceDefault {
    update(delta: number, state: D2StateRainbow): void;
    render(context: OffscreenCanvasRenderingContext2D, state: D2StateRainbow): void;
}
