import { ActionCreator } from "@ogod/common";
export declare const ogodFactoryReactiveArrayString: (defaultValue: Array<string>, changesCreator: ActionCreator, connect?: any, observe?: any) => {
    get: (host: any, value?: string[]) => string[];
    set: (host: any, value: any, lastValue: any) => any;
    observe: (host: any, value: any, old: any) => void;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
export declare const ogodFactorySceneArrayString: (defaultValue?: any[], connect?: any, observe?: any) => {
    get: (host: any, value?: string[]) => string[];
    set: (host: any, value: any, lastValue: any) => any;
    observe: (host: any, value: any, old: any) => void;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
export declare const ogodFactoryInstanceArrayString: (defaultValue?: any[], connect?: any, observe?: any) => {
    get: (host: any, value?: string[]) => string[];
    set: (host: any, value: any, lastValue: any) => any;
    observe: (host: any, value: any, old: any) => void;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
export declare const ogodFactorySystemArrayString: (defaultValue?: any[], connect?: any, observe?: any) => {
    get: (host: any, value?: string[]) => string[];
    set: (host: any, value: any, lastValue: any) => any;
    observe: (host: any, value: any, old: any) => void;
    connect?(host: any, key: string, invalidate: Function): void | Function;
};
