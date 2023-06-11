import { Shape, SHAPES } from "./renderer/draw";

export function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

export function colorPart() {
    const c = Math.floor(Math.random() * 256).toString(16);
    return c.length < 2 ? '0' + c : c;
}

export function randomColor() {
    return `#${colorPart()}${colorPart()}${colorPart()}`;
}

export function randShape(): Shape {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

export function randSize(max: number) {
    return Math.max(max, Math.round(Math.random() * max));
}
