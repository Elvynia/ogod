import { BehaviorSubject, Subject } from "rxjs";
import { UpdateState } from "../update/state";

export type RenderState<T = any> = [UpdateState, T];

export type Renderer<T = any> = (update: UpdateState, state: T) => void;

export class RendererSubject<T = any> extends Subject<RenderState<T>> {
    protected renderers: BehaviorSubject<Renderer<T>[]>;

    get renderers$(): BehaviorSubject<Renderer<T>[]> {
        return this.renderers;
    }

    constructor(renderers: Renderer<T>[] = []) {
        super();
        this.renderers = new BehaviorSubject(renderers);
    }

    override next(value: RenderState<T>): void {
        super.next(value);
        for (const renderer of this.renderers.value) {
            renderer(...value);
        }
    }

}
