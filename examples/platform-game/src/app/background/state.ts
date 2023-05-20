import { BackgroundGradient } from "./gradient/state";

export interface Background {
    baseColor: string;
    colors?: string[];
    // FIXME: Use camera.x changes to remove this property.
    lastPos?: number;
    gradient: BackgroundGradient;
}
