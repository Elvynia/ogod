export const WORLD_SCALE = 20;

export function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

export function randValue(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min))
}

export function randColor() {
    let c = Math.floor(Math.random() * 16777215).toString(16);
    while (c.length < 6) {
        c += '0';
    }
    return '#' + c;
}
