import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2PolygonShape, b2World } from '@box2d/core';
import { AppSize } from './state';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    body: b2BodyDef;
    _body?: b2Body;
    fixtures: b2FixtureDef[];
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

export const makeAddRect = (app: AppSize, parseRect) => (x: number, y: number, width: number = randSize(20, 50),
    height: number = randSize(20, 50), type: b2BodyType = b2BodyType.b2_dynamicBody, density: number = 10, angle: number = 0) => {
    const b2Width = width / (2 * app.scale);
    const b2Height = height / (2 * app.scale);
    return parseRect({
        id: randNum(6),
        x,
        y,
        width,
        height,
        toggleColor: randomColor(),
        color: randomColor(),
        body: {
            position: {
                x: x / app.scale,
                y: y / app.scale
            },
            type,
            angle
        } as b2BodyDef,
        fixtures: [{
            shape: new b2PolygonShape().SetAsBox(b2Width, b2Height),
            density,
            restitution: 0.9
        } as b2FixtureDef]
    });
};

export const makeParseRect = (world: b2World) => (rect: Rect) => {
    const _body = world.CreateBody(rect.body);
    rect.fixtures.forEach((fd) => _body.CreateFixture(fd));
    return {
        ...rect,
        _body
    } as Rect;
}
