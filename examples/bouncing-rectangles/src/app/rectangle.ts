import { b2Body, b2BodyType, b2Fixture, b2PolygonShape, b2World } from '@box2d/core';
import { AppSize } from './state';

export interface Rect {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    body: b2Body;
    fixtures: b2Fixture[];
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

export type CreateRectFn = (x: number, y: number, width?: number, height?: number, dynamic?: boolean, density?: number,
    angle?: number) => Rect;

export const makeCreateRect = (app: AppSize, world: b2World): CreateRectFn => (x: number, y: number, width: number = randSize(20, 50),
    height: number = randSize(20, 50), dynamic: boolean = true, density: number = 10, angle: number = 0) => {
    const id = randNum(8).toString();
    const b2Width = width / (2 * app.scale);
    const b2Height = height / (2 * app.scale);
    const body = world.CreateBody({
        position: {
            x: x / app.scale,
            y: y / app.scale
        },
        linearVelocity: dynamic ? {
            x: randSpeed(),
            y: randSpeed()
        } : undefined,
        type: dynamic ? b2BodyType.b2_dynamicBody : b2BodyType.b2_staticBody,
        angle,
        userData: id
    });
    return {
        id,
        x,
        y,
        width,
        height,
        toggleColor: randomColor(),
        color: randomColor(),
        body,
        fixtures: [body.CreateFixture({
            shape: new b2PolygonShape().SetAsBox(b2Width, b2Height),
            density,
            restitution: 1.2
        })],
        health: Math.round(width * height / 100)
    };
};
