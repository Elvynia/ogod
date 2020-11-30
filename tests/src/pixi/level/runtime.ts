import { OgodStateEngine } from '@ogod/common';
import { OgodRuntimeEngine, OgodRuntimeInstanceDefault, OgodStateWorld } from '@ogod/runtime-core';
import { PixiStateSpritesheet, waitForResource } from '@ogod/runtime-pixi';
import * as TileMap from 'pixi-tilemap';
import { empty, Observable, range } from 'rxjs';
import { filter, first, map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { RADAR } from '../radar';
import { PixiStateLevel } from './state';
import { Box2dStateBody, WORLD_RATIO, box2dCreateBody } from '@ogod/runtime-box2d';

declare var self: OgodRuntimeEngine;

export class PixiRuntimeLevel extends OgodRuntimeInstanceDefault {
    world: any;

    initialize(state: PixiStateLevel, state$: Observable<OgodStateEngine>) {
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
                flatness: 80,
                gapFreq: 1,
                gapSizeMin: 1,
                gapSizeMax: 2,
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

    update(delta: number, state: PixiStateLevel) {
        const fullState = self.store.getState();
        const camera = (fullState.system['world'] as OgodStateWorld).camera;
        if (camera) {
            state.instance$.position.x = -camera.worldX;
            state.instance$.position.y = camera.height - state.instance$.height + camera.worldY;
        }
        return empty();
    }

    private createTilemap(state: PixiStateLevel, data: PIXI.Spritesheet): TileMap.CompositeRectTileLayer & PIXI.Sprite {
        const tilemap: TileMap.CompositeRectTileLayer & PIXI.Sprite = new TileMap.CompositeRectTileLayer(-1, Object.values(data.textures)) as any;
        tilemap.scale.x = state.scale;
        tilemap.scale.y = state.scale;
        tilemap.zIndex = state.index || 0;
        return tilemap;
    }

    private createLevel(state: PixiStateLevel) {
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
        this.createBodies(state, tiles);
    }

    private generateGround(state: PixiStateLevel): boolean[][] {
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
            if (rChange > state.flatness || height === 0) {
                const rDir = this.nextRand(-100 * height, 100 * state.height / height);
                if (rDir > 0 && height < state.height - 1) {
                    height += this.nextRand(1, Math.min(3, state.height - height));
                } else if (rDir < 0 && height > 1) {
                    height -= this.nextRand(1, Math.min(3, height))
                }
            }
            const rGap = this.nextRand(0, 100);
            if (rGap < state.gapFreq) {
                const gap = this.nextRand(state.gapSizeMin, state.gapSizeMax);
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

    private createBodies(state: PixiStateLevel, tiles) {
        const bodies: { id: string, body: Box2dStateBody }[] = [];
        const debugs = [];
        tiles.forEach(({ x, y, id, radar }) => {
            if (radar !== 255) {
                const size = Math.round(state.tileSize * state.scale) / WORLD_RATIO;
                let shape = state.resource$.data.frames[radar + '.png']?.shape;
                // console.log('tile ', x, y, id, radar)
                if (shape) {
                    shape = {
                        vertices: shape.vertices.map((v) => ({ x: v.x * size, y: v.y * size }))
                    }
                } else {
                    shape = {
                        x: size / 2,
                        y: size / 2,
                        centerX: size / 2,
                        centerY: size / 2
                    };
                    debugs.push({ x, y, id, radar });
                }
                bodies.push({
                    id,
                    body: {
                        x: Math.round(x * state.tileSize * state.scale) / WORLD_RATIO,
                        y: Math.round(state.instance$.height - (y + 1) * state.tileSize * state.scale) / WORLD_RATIO,
                        fixtures: [{
                            friction: 0.001,
                            restitution: 0,
                            shape
                        }]
                    }
                });
            }
        });
        bodies.forEach(({ body, id }) => {
            const state: any = { id, body };
            state.body$ = box2dCreateBody(this.world, state);
        });
        debugs.forEach(({ x, y, id, radar }) => console.log('Shape missing for tile ', x, y, id, radar));
    }

    private nextRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
