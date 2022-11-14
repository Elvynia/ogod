export interface NoiseSource {
    generator: () => (x: number, y: number) => number;
    scale: number;
    offset: () => number;
}

export interface NoiseView {
    x: number;
    y: number;
    size: number;
    data: ImageData;
}
