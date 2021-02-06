import { OgodElementActor } from "@ogod/element-core";

export interface ThreeElementRenderer extends OgodElementActor<'renderer'>  {
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
}
