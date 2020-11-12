import { Hybrids } from 'hybrids';
import { box2dHybridShape } from '../shape/hybrid';
import { Box2dElementShapePoly } from './element';

export function box2dHybridShapePoly(): Hybrids<Box2dElementShapePoly> {
    return {
        ...box2dHybridShape(),
        // vertices: TODO: factory
    }
}
