export const PI2 = 2 * Math.PI;

export function makeRandNum(length: number = 8): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

export function makeRandInRange(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
