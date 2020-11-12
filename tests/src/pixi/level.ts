import { OgodStateEngine, OgodStateInstance } from '@ogod/common';
import { OgodRuntimeInstanceDefault, OgodRuntimeEngine } from '@ogod/runtime-core';
import { PixiStateSpritesheet, PixiStateWorld, waitForResource } from '@ogod/runtime-pixi';
import * as TileMap from 'pixi-tilemap';
import { empty, Observable, range } from 'rxjs';
import { filter, first, map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { RADAR } from './radar';

declare var self: OgodRuntimeEngine;

export interface LevelState extends OgodStateInstance {
    resource$: PIXI.Spritesheet;
    instance$: TileMap.CompositeRectTileLayer & PIXI.Sprite;
    tileExtension: string;
    tileSize: number;
    width: number;
    height: number;
    flatness: number;
    gapFreq: number;
    gapSizeMin: number;
    gapSizeMax: number;
    scale: number;
    worldX: number;
    worldY: number;
}

export class LevelRuntime extends OgodRuntimeInstanceDefault {
    world: any;

    initialize(state: LevelState, state$: Observable<OgodStateEngine>) {
        state.scale = 0.25;
        return waitForResource<PixiStateSpritesheet>(state as any, state$).pipe(
            map((data) => ({
                ...state,
                resource$: data,
                instance$: this.createTilemap(state, data),
                tileExtension: '.png',
                tileSize: 512,
                width: 100,
                height: 6,
                flatness: 50,
                gapFreq: 1,
                gapSizeMin: 2,
                gapSizeMax: 4,
                worldX: 0,
                worldY: 0
            })),
            switchMap((initState) => state$.pipe(
                filter((fs) => fs.system['physics'] && fs.system['physics'].loaded
                    && fs.system['world'] && fs.system['world'].loaded),
                first(),
                tap((fs) => this.world = fs.system['physics']['world$']),
                mapTo(initState)
            )),
            tap((initState) => this.createLevel(initState)),
            switchMap((initState) => super.initialize(initState, state$))
        );
    }

    update(delta: number, state: LevelState) {
        const fullState = self.store.getState();
        const camera = (fullState.system['world'] as PixiStateWorld).camera;
        if (camera) {
            state.instance$.position.x = -camera.worldX;
            state.instance$.position.y = camera.height - state.instance$.height + camera.worldY;
        }
        return empty();
    }

    private createTilemap(state: LevelState, data: PIXI.Spritesheet): TileMap.CompositeRectTileLayer & PIXI.Sprite {
        const tilemap: TileMap.CompositeRectTileLayer & PIXI.Sprite = new TileMap.CompositeRectTileLayer(-1, Object.values(data.textures)) as any;
        tilemap.scale.x = state.scale;
        tilemap.scale.y = state.scale;
        return tilemap;
    }
 
    private createLevel(state: LevelState) {
        const ground = this.generateGround(state);
        let tiles = [];
        for (let y = 0; y < ground.length; ++y) {
            const line = [];
            for (let x = 0; x < ground[y].length; ++x) {
                if (ground[y][x]) {
                    line.push({
                        x,
                        y,
                        radar: this.getRadar(ground, x, y),
                        id: state.id + '_' + x + '_' + y
                    });
                }
            }
            tiles.push(...line);
        }
        tiles.forEach((tile) => state.instance$.addFrame(tile.radar + state.tileExtension, state.tileSize * tile.x, state.tileSize * tile.y));
        tiles.forEach((tile) => {
            // const body = this.getBody(state, tile.radar, tile.x, tile.y);
            // if (body) {
            //     pixiCreateBody(this.world, body, tile.id);
            // }
        });
    }

    private generateGround(state: LevelState): boolean[][] {
        let tiles: boolean[][];
        range(0, state.height).pipe(
            switchMap(() => range(0, state.width).pipe(
                map(() => false),
                toArray()
            )),
            toArray()
        ).subscribe((result) => tiles = result);
        let height = 1;
        let x = 0;
        while (x < state.width) {
            range(0, height).subscribe((i) => tiles[i][x] = true);
            const rChange = this.nextRand(0, 100);
            if (rChange > state.flatness) {
                const rDir = this.nextRand(-100 * height, 100 * state.height / height);
                if (rDir > 0 && height < state.height - 1) {
                    height += this.nextRand(1, Math.min(3, state.height - height));
                } else if (height > 1) {
                    height -= this.nextRand(1, Math.min(3, height))
                }
            }
            const rGap = this.nextRand(0, 100);
            if (rGap < state.gapFreq) {
                const gap = this.nextRand(state.gapSizeMin, state.gapSizeMax) + 1;
                x += gap;
            } else {
                ++x;
            }
        }
        return tiles.reverse();
    }

    private getRadar(ground: Array<boolean[]>, x: number, y: number): RADAR {
        let result = 0;
        if (x > 0 && ground[y][x - 1]) {
            result += RADAR.W;
        }
        if (y > 0 && ground[y - 1][x]) {
            result += RADAR.N;
        }
        if (x < ground[y].length - 1 && ground[y][x + 1]) {
            result += RADAR.E;
        }
        if (y < ground.length - 1 && ground[y + 1][x]) {
            result += RADAR.S;
        }
        if (result & RADAR.E && result & RADAR.N && ground[y - 1][x + 1]) {
            result += RADAR.NE;
        }
        if (result & RADAR.E && result & RADAR.S && ground[y + 1][x + 1]) {
            result += RADAR.SE;
        }
        if (result & RADAR.W && result & RADAR.N && ground[y - 1][x - 1]) {
            result += RADAR.NW;
        }
        if (result & RADAR.W && result & RADAR.S && ground[y + 1][x - 1]) {
            result += RADAR.SW;
        }
        // console.log('parse value : ', result, result & DIR.N, result & DIR.E, result & DIR.S,
        //      result & DIR.W, result & DIR.NE, result & DIR.SE, result & DIR.SW, result & DIR.NW)
        return result;
    }

    // private getBody(state: LevelState, radar: RADAR, x: number, y: number): Box2dBody {
    //     if (radar === 255) {
    //         return null;
    //     }
    //     const b = {
    //         x: x * state.tileSize * state.scale / WORLD_RATIO,
    //         y: (state.instance$.height - (y+1) * state.tileSize * state.scale) / WORLD_RATIO,
    //         shape: {
    //             x: (state.tileSize / 2) * state.scale / WORLD_RATIO,
    //             y: (state.tileSize / 2) * state.scale / WORLD_RATIO,
    //             centerX: 256 * state.scale / WORLD_RATIO,
    //             centerY: 256 * state.scale / WORLD_RATIO
    //         }
    //     };
        
    //     return b;
    // }

    private nextRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}