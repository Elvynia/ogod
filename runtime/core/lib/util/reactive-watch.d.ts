import { Subscription } from "rxjs";
import { OgodCategoryRuntime } from "./category";
export declare function watchReactiveStates<C extends keyof OgodCategoryRuntime>(category: C): Subscription;
