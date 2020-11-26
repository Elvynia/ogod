import { OgodActionActor, OgodCategoryState, OgodStateActor } from "@ogod/common";
import { OgodRuntimeActor } from "../actor/runtime";
import { OgodUpdateFunction } from "./reactive-update";

export interface OgodRegistry {
    [key: string]: new () => OgodRuntimeActor<OgodStateActor<any>, OgodActionActor<any>>
}

export class OgodRuntimeRegistry {
    registry: OgodRegistry;

    constructor(registry: OgodRegistry) {
        this.registry = registry;
    }

    hasRuntime(category: string, runtime: string) {
        return this.registry[`${category}.${runtime}`] != null;
    }

    createRuntime<
        R extends OgodRuntimeActor<S, OgodActionActor<S>>,
        S extends OgodStateActor<C>,
        C extends string = S['category']
    >(category: C, runtimeName: string, updates?: Array<string>) {
        const id = `${category}.${runtimeName}`;
        const runtime = new this.registry[id]() as R;
        return runtime;
    }
}
