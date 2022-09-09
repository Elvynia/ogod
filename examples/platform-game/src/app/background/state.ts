import { BackgroundGradient } from "../util";

export interface Background {
    colors: string[];
    lastPos?: number;
    gradients: Array<BackgroundGradient>;
}
