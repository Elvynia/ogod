import { from, Observable } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { ogodFetch } from "@ogod/runtime-core";
import { BaseTexture, ImageBitmapResource } from "pixi.js";

export function fetchBaseTexture(path: string): Observable<BaseTexture> {
    return from(ogodFetch(path)).pipe(
        switchMap((response) => response.blob()),
        switchMap((blob) => createImageBitmap(blob)),
        map((image) => new ImageBitmapResource(image)),
        map((resource) => new BaseTexture(resource)));
}
