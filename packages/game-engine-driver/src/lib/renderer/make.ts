import { Renderer, RenderFunction } from '@ogod/game-core';

export function makeRenderer(render: RenderFunction, operator?: any): Renderer {
    return {
        render,
        observable: operator
    }
}
