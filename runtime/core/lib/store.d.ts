import { OgodStore } from "@ogod/common";
import { Epic } from "redux-observable";
import { ReducersMapObject } from "redux";
export declare function ogodConfigureStore(reducers: ReducersMapObject, epics: Epic[]): OgodStore;
