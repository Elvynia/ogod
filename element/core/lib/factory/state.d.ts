import { ActionCreator, OgodStateActor, OgodCategoryState } from "@ogod/common";
export declare function ogodFactoryState<S extends OgodStateActor<C>, C extends keyof OgodCategoryState = S['category']>(defaultKeys: string[], initCreator: ActionCreator, destroyCreator: ActionCreator): {
    get: (host: any, lastValue: any) => any;
    set: (host: any, value: any, lastValue: any) => any;
    connect: (host: any, _: any, invalidate: any) => () => void;
};
