"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodEpics = void 0;
const epic_1 = require("./system/epic");
const epic_2 = require("./scene/epic");
const epic_3 = require("./resource/epic");
const epic_4 = require("./instance/epic");
const epic_5 = require("./engine/epic");
exports.ogodEpics = [
    epic_4.epicInstanceInit,
    epic_4.epicInstanceChanges,
    epic_4.epicInstanceDestroy,
    epic_3.epicResourceInit,
    epic_3.epicResourceDestroy,
    epic_2.epicSceneInit,
    epic_2.epicSceneChanges,
    epic_2.epicSceneDestroy,
    epic_1.epicSystemInit,
    epic_1.epicSystemChanges,
    epic_1.epicSystemDestroy,
    epic_5.epicEngineReflectChanges
];
//# sourceMappingURL=epics.js.map