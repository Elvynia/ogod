import { b2BodyType, b2PolygonShape, b2World } from '@box2d/core';
import { randNum } from '../util';
import { Rect } from './state';

function colorPart() {
    const c = Math.floor(Math.random() * 256).toString(16);
    return c.length < 2 ? '0' + c : c;
}

function randomColor() {
    return `#${colorPart()}${colorPart()}${colorPart()}`;
}

function randSize(min: number, max: number) {
    return Math.max(min, Math.round(Math.random() * max));
}

function randSpeed(max: number = 10) {
    return Math.round(max - Math.random() * max * 2)
}

function isColorLight(color: string) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 125;
}

export function makeRect(rect: Partial<Rect>, world: b2World, scale: number) {
    const id = rect.id || randNum(8).toString();
    const width = rect.width || randSize(20, 50);
    const height = rect.height || randSize(20, 50);
    const b2Width = width / (2 * scale);
    const b2Height = height / (2 * scale);
    const health = Math.round(width * height / 50);
    const body = world.CreateBody({
        position: {
            x: rect.x / scale,
            y: rect.y / scale
        },
        linearVelocity: rect.dynamic ? {
            x: randSpeed(),
            y: randSpeed()
        } : undefined,
        type: rect.dynamic ? b2BodyType.b2_dynamicBody : b2BodyType.b2_staticBody,
        angle: -(rect.angle || 0)
    });
    body.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(b2Width, b2Height),
        density: 10,
        restitution: 1.2
    });
    const color = rect.color || randomColor();
    return {
        ...rect,
        body,
        id,
        width,
        height,
        color,
        colorLight: typeof color === 'string' ? isColorLight(color) : false,
        health
    } as Rect;
}
