import { OgodActionActor, OgodStateActor } from "@ogod/common";
import { OgodRuntimeActor } from "../actor/runtime";

export interface OgodRegistry {
    [key: string]: new () => OgodRuntimeActor<OgodStateActor<any>, OgodActionActor<any>> | any;
}

export class OgodRuntimeRegistry {
    entries: OgodRegistry;

    constructor(registry: OgodRegistry) {
        this.entries = registry;
    }

    hasRuntime(category: string, runtime: string) {
        return this.entries[`${category}.${runtime}`] != null;
    }

    createRuntime<R>(category: string, runtimeName: string) {
        return new this.entries[`${category}.${runtimeName}`]() as R;
    }

    createActorRuntime<
        R extends OgodRuntimeActor<S, OgodActionActor<S>>,
        S extends OgodStateActor<C>,
        C extends string = S['category']
    >(category: C, runtimeName: string) {
        return new this.entries[`${category}.${runtimeName}`]() as R;
    }
}
