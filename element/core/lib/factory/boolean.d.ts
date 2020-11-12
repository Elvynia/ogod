import { ActionCreator } from "@ogod/common";
export declare function ogodFactoryReactiveBoolean(defaultValue: boolean, changesCreator: ActionCreator, connect?: any, observe?: any): {
    get: (host: any, value: any) => any;
    set: (host: any, value: any, lastValue: any) => any;
    connect: (host: HTMLElement, key: string, invalidate: any) => () => void;
    observe: any;
};
export declare const ogodFactorySceneBoolean: (defaultValue: boolean, connect?: any, observe?: any) => {
    get: (host: any, value: any) => any;
    set: (host: any, value: any, lastValue: any) => any;
    connect: (host: HTMLElement, key: string, invalidate: any) => () => void;
    observe: any;
};
export declare const ogodFactoryInstanceBoolean: (defaultValue: boolean, connect?: any, observe?: any) => {
    get: (host: any, value: any) => any;
    set: (host: any, value: any, lastValue: any) => any;
    connect: (host: HTMLElement, key: string, invalidate: any) => () => void;
    observe: any;
};
export declare const ogodFactorySystemBoolean: (defaultValue: boolean, connect?: any, observe?: any) => {
    get: (host: any, value: any) => any;
    set: (host: any, value: any, lastValue: any) => any;
    connect: (host: HTMLElement, key: string, invalidate: any) => () => void;
    observe: any;
};
