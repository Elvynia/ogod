import { map } from 'rxjs/operators';
import { contextNext } from './action';
import { OgodRuntimeEngine } from "@ogod/runtime-core";
import { Epic, ofType } from "redux-observable";
import { D2StateEngine } from "../engine/state";
import { engineCanvas } from '@ogod/common';

declare var self: OgodRuntimeEngine;

export const epicContextNext: Epic<any, any, D2StateEngine> = (actions$) => actions$.pipe(
    ofType(engineCanvas.type),
    map(() => contextNext({ context: self.canvas.getContext('2d') }))
);
