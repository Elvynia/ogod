import { MonoTypeOperatorFunction, Observable } from "rxjs";

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

const defaultComparator = (a, b) => a === b;

export function distinctState<T>(params: {
    comparator?: (previous: T, current: T) => boolean,
    initialValue?: T,
}): MonoTypeOperatorFunction<T>;
export function distinctState<T, K extends keyof T = keyof T>(params: {
    comparator?: (previous: T[K], current: T[K]) => boolean,
    key: K,
    initialValue?: T[K],
}): MonoTypeOperatorFunction<T>;
export function distinctState<T, K extends keyof T = keyof T>(params: {
    comparator?: (previous: T | T[K], current: T | T[K]) => boolean,
    key?: K,
    initialValue?: T | T[K],
}): MonoTypeOperatorFunction<T> {
    return (source) => new Observable((subscriber) => {
        const resolver = params.key ? (value) => value[params.key] : (value) => value;
        const comparator = params.comparator || defaultComparator;
        const sub = source.subscribe((value) => {
            const nextValue = resolver(value);
            if (!comparator(params.initialValue, nextValue)) {
                params.initialValue = resolver(value);
                subscriber.next(value);
            }
        });
        return () => sub.unsubscribe();
    });
}
