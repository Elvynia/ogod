import { Subject } from "rxjs";
export declare function ogodFactoryState$(): {
    get: () => Subject<unknown>;
    connect: (host: any) => void;
};
