import { baseObjectVelocity } from './movement';

export const makeRectangle = (x: number, y: number, width: number, height: number) => ({
    x,
    y,
    width,
    height,
    toggleColor: '#FF0000',
    color: '#0000FF',
    velocity: { ...baseObjectVelocity },
});
