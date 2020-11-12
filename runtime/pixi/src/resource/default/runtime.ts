import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ogodFetch } from "@ogod/runtime-core";

export function fetchBaseTexture(path: string): Observable<PIXI.BaseTexture> {
    return from(ogodFetch(path)).pipe(
        switchMap((response) => response.blob()),
        switchMap((blob) => createImageBitmap(blob)),
        map((image) => new PIXI.resources.ImageBitmapResource(image)),
        map((resource) => new PIXI.BaseTexture(resource)));
}
