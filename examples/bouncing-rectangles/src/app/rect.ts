import { b2Body, b2BodyType, b2PolygonShape, b2World } from '@box2d/core';

export interface Rect {
    angle: number;
    dynamic: boolean;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string | CanvasGradient;
    body: b2Body;
    health: number;
}

function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

function colorPart() {
    return Math.floor(Math.random() * 256).toString(16);
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

export function makeRect(rect: Partial<Rect>, world: b2World, scale: number): Rect {
    const id = rect.id || randNum(8).toString();
    const width = rect.width || randSize(20, 50);
    const height = rect.height || randSize(20, 50);
    const b2Width = width / (2 * scale);
    const b2Height = height / (2 * scale);
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
        angle: rect.angle,
        userData: id
    });
    body.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(b2Width, b2Height),
        density: 10,
        restitution: 1.2
    })
    return {
        ...rect,
        body,
        id,
        width,
        height,
        color: rect.color || randomColor(),
        health: Math.round(width * height / 100)
    } as Rect;
}
