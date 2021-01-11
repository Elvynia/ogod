import { OgodStateActor } from "@ogod/common";
import { WebGLRenderer } from 'three';

export interface ThreeStateRenderer extends OgodStateActor<'renderer'> {
    precision?: 'highp' | 'mediump' | 'lowp'; // highp
    alpha?: boolean; // false
    premultipliedAlpha?: boolean; // true
    antialias?: boolean; // false
    stencil?: boolean; // true
    preserveDrawingBuffer?: boolean; // false
    powerPreference?: 'default' | 'high-performance' | 'low-power'; // default
    failIfMajorPerformanceCaveat?: boolean; // false
    depth?: boolean; // true
    logarithmicDepthBuffer?: boolean; // false
    // autoClear, autoClearColor/Depth/Stencil
    renderer$?: WebGLRenderer;
}
