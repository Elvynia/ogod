import { b2World } from "@box2d/core";
import { Subject } from "rxjs";
import { Contact } from "../contact/state";

export interface GameBox2dSource {
    contact$: Subject<Contact>;
    dispose: Function;
    instance: b2World;
}
