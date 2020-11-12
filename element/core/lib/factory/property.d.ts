import { ActionCreator } from '@ogod/common';
export declare function ogodFactoryReactiveProperty(defaultValue: any, changesCreator: ActionCreator, connect?: any, observe?: any): {
    observe: (host: any, value: any, old: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
export declare const ogodFactorySceneProperty: (defaultValue: any, connect?: any, observe?: any) => {
    observe: (host: any, value: any, old: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
export declare const ogodFactoryInstanceProperty: (defaultValue: any, connect?: any, observe?: any) => {
    observe: (host: any, value: any, old: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
export declare const ogodFactorySystemProperty: (defaultValue: any, connect?: any, observe?: any) => {
    observe: (host: any, value: any, old: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
