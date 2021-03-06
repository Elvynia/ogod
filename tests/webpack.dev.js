
var path = require("path");

var config = {
    mode: 'development',
    entry: {
        coreRuntime: path.resolve(__dirname, 'src/core/runtime.ts'),
        coreElement: path.resolve(__dirname, 'src/core/element.ts'),
        coreWorker: path.resolve(__dirname, 'src/core/worker.ts'),
        pixiRuntime: path.resolve(__dirname, 'src/pixi/runtime.ts'),
        pixiElement: path.resolve(__dirname, 'src/pixi/element.ts'),
        pixiWorker: path.resolve(__dirname, 'src/pixi/worker.ts'),
        box2dRuntime: path.resolve(__dirname, 'src/box2d/runtime.ts'),
        box2dElement: path.resolve(__dirname, 'src/box2d/element.ts'),
        box2dWorker: path.resolve(__dirname, 'src/box2d/worker.ts'),
        threeRuntime: path.resolve(__dirname, 'src/three/runtime.ts'),
        threeWorker: path.resolve(__dirname, 'src/three/worker.ts'),
        threeElement: path.resolve(__dirname, 'src/three/element.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: "ts-loader" }
        ]
    }
}

module.exports = config;
