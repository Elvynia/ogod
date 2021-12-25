import { Action } from "redux";


export interface OgodActionCreator<P = object> {
    type: string;
    (payload?: P): Action<string> & P;
}

export function ogodActionName(category: string, name: string, prefix: string = 'OGOD'): string {
    return `[${prefix}][${category}] ${name}`;
}

export function ogodActionCreator<P>(type: string): OgodActionCreator<P> {
    return Object.assign(
        (payload?: P) => ({ type, ...payload }),
        { type }
    );
}
