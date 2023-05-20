import gsap, { Linear } from 'gsap';
import { delay, from, ignoreElements } from 'rxjs';
import { AppState } from '../../state';
import { Sleet } from './state';
import { randValue } from '../../util';

export function makeSleet(value: Pick<Sleet, 'x' | 'y'> & Partial<Sleet>): Sleet {
    return {
        ...value,
        width: value.width || randValue(5, 12),
        radius: value.radius || randValue(20, 60),
        color: value.color || "#07AF19",
        id: value.id || randValue(0, 100000).toString(),
        dir: value.dir || randValue(0, 1) > 0.5 ? -1 : 1,
        angleStart: value.angleStart || Math.PI,
        angleStop: value.angleStop || 1.1 * Math.PI
    }
}

function makeBounce(splash: AppState['splash'], tl: gsap.core.Timeline, sleet: Sleet, start: number, duration: number = 1, count: number = 2) {
    let nextSleet;
    if (count > 0) {
        const quarterDuration = duration / 4;
        nextSleet = makeSleet({ ...sleet, id: undefined, x: sleet.x + 2 * sleet.radius, y: sleet.y });
        tl.to(sleet, {
            duration,
            angleStop: 2 * Math.PI,
            ease: Linear.easeIn,
            onComplete: () => makeBounce(splash, tl, nextSleet, start + duration, duration, --count)
        }, start).to(sleet, {
            duration: 3 * quarterDuration,
            angleStart: 2 * Math.PI,
            ease: Linear.easeOut,
            onComplete: () => delete splash[sleet.id]
        }, start + quarterDuration);
        splash[sleet.id] = sleet;
    }
    return tl;
}

export function makeSleetBounce$(state: AppState) {
    return (x: number, y: number) => {
        return from(makeBounce(state.splash, gsap.timeline(), makeSleet({ x, y, radius: 30 }), 0).then()).pipe(
            delay(200),
            ignoreElements()
        );
    }
}
