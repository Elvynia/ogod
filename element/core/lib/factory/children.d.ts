import { ActionCreator } from "@ogod/common";
export declare const ogodFactoryReactiveChildren: (category: string, changesCreator: ActionCreator, multiple?: boolean, connect?: any) => {
    connect(host: any, key: any, invalidate: any): () => void;
    observe: (host: any, values: Array<any>, lastValue: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
};
export declare const ogodFactorySceneChildren: (category: string, multiple?: boolean, connect?: any) => {
    connect(host: any, key: any, invalidate: any): () => void;
    observe: (host: any, values: Array<any>, lastValue: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
};
export declare const ogodFactoryInstanceChildren: (category: string, multiple?: boolean, connect?: any) => {
    connect(host: any, key: any, invalidate: any): () => void;
    observe: (host: any, values: Array<any>, lastValue: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
};
export declare const ogodFactorySystemChildren: (category: string, multiple?: boolean, connect?: any) => {
    connect(host: any, key: any, invalidate: any): () => void;
    observe: (host: any, values: Array<any>, lastValue: any) => void;
    get?(host: any, lastValue: any): any;
    set?(host: any, value: any, lastValue: any): any;
};
