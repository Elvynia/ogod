export declare const ogodFactoryParent: (category: string) => import("hybrids").Descriptor<HTMLElement>;
export declare const ogodFactoryReactiveParent: (category: string, changesAction?: string, connect?: any) => {
    connect: (host: any, key: any, invalidate: any) => any;
    get?(host: HTMLElement, lastValue: any): any;
    set?(host: HTMLElement, value: any, lastValue: any): any;
    observe?(host: HTMLElement, value: any, lastValue: any): void;
};
