import { Hybrids } from 'hybrids';
import { BehaviorSubject, Subject } from "rxjs";

export interface OgodElementEngine extends HTMLElement {
    category: 'engine';
    id: string;
    worker: Worker;
    workerPath: string;
    canvas: boolean;
    target: HTMLCanvasElement;
    targetOffscreen: OffscreenCanvas;
    running: boolean;
    state$: BehaviorSubject<{ [id: string]: any }>;
    update$: Subject<{ id: string, state: any }>;
    render: Function;
}
