import { Epic } from "redux-observable";
import { OgodActionActor, OgodStateEngine, OgodActionReactive } from "@ogod/common";
export declare function removeTransients(state: any): any;
export declare const epicDebugActions: Epic<OgodActionActor<any>, any, OgodStateEngine>;
export declare const epicEngineReflectChanges: Epic<OgodActionReactive<any>, any, OgodStateEngine>;
