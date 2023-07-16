import { TweenTargets, UpdateState, tweenObject } from "@ogod/core";
import { AnyShape, XY } from "@ogod/examples-common";
import { Observable } from "rxjs";

function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function easeInOutElastic(x: number): number {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5
                ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}
function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function makeObjectAnimation(obj: AnyShape, xy: XY, update$: Observable<UpdateState>) {
    const target: TweenTargets<any> = {
        x: { value: xy.x },
        y: { value: xy.y },
        opacity: {
            value: 1,
            easeFn: easeInOutSine
        }
    };
    switch (obj.type) {
        case 'circle':
            target.radius = {
                value: 1,
                easeFn: easeInOutSine
            };
        case 'rect':
            target.width = {
                value: 1,
                easeFn: easeInOutSine
            };
            target.height = {
                value: 1,
                easeFn: easeInOutSine
            };
    }
    return tweenObject({
        source: obj,
        easeFn: easeInOutElastic,
        duration: 2000,
        target,
        update$
    });
}

export function makeObjectAnimationReset(obj: AnyShape, update$: Observable<UpdateState>) {
    const target: TweenTargets<any> = {
        opacity: {
            value: 0.1
        }
    };
    switch (obj.type) {
        case 'circle':
            target.radius = {
                value: 500
            };
        case 'rect':
            target.width = {
                value: 500
            };
            target.height = {
                value: 500
            };
    }
    return tweenObject({
        source: obj,
        easeFn: easeOutExpo,
        duration: 400,
        target,
        update$
    });
}
