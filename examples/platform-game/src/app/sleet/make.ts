import { Sleet } from './state';

function randValue(min: number, max: number) {
    return Math.round(Math.random() * max)
}

export function makeSleet(x: number, y: number): Sleet {
    return {
        x,
        y,
        width: randValue(2, 15),
        radius: randValue(20, 60),
        color: "#07AF19",
        id: randValue(0, 100000).toString(),
        dir: randValue(0, 1) > 0.5 ? -1 : 1,
        angleStart: -Math.PI / 3,
        angleStop: 0
    }
}
